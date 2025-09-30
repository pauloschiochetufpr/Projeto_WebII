import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// testes
export interface ReceitaPorDia {
  data: string;
  receitaTotal: number;
  quantidade: number;
  detalhes?: DetalheServico[];
}

export interface ReceitaPorCategoria {
  categoria: string;
  receitaTotal: number;
  quantidade: number;
  percentual?: number;
}

export interface DetalheServico {
  id: number;
  nomeCliente: string;
  descricaoEquipamento: string;
  valor: number;
  dataPagamento: string;
}

@Injectable({
  providedIn: 'root'
})
export class RelatorioService {
  private apiUrl = 'http://localhost:8080/api'; // --> Colocar para a api do springboot

  constructor(private http: HttpClient) {}

  // RF019
  obterReceitasPorPeriodo(dataInicio?: string, dataFim?: string): Observable<ReceitaPorDia[]> {
    let params: any = {};
    if (dataInicio) params.startDate = dataInicio;
    if (dataFim) params.endDate = dataFim;
    
    return this.http.get<any[]>(`${this.apiUrl}/reports/revenue-by-period`, { params })
      .pipe(
        map(dados => this.agruparReceitasPorDia(dados))
      );
  }

  // RF020
  obterReceitasPorCategoria(): Observable<ReceitaPorCategoria[]> {
    return this.http.get<ReceitaPorCategoria[]>(`${this.apiUrl}/reports/revenue-by-category`);
  }

  // Receita por Período
  gerarPdfReceitasPorPeriodo(dados: ReceitaPorDia[], dataInicio?: string, dataFim?: string): void {
    const doc = this.criarDocumentoPDF();
    
    const cabecalho = this.criarCabecalho('RELATÓRIO DE RECEITAS POR PERÍODO');
    const infoPeriodo = this.criarInfoPeriodo(dataInicio, dataFim);
    const tabela = this.criarTabelaReceitas(dados);
    const resumo = this.criarResumoReceitas(dados);

    const conteudo = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>${this.estilosPDF()}</style>
      </head>
      <body>
        ${cabecalho}
        ${infoPeriodo}
        ${tabela}
        ${resumo}
        <div class="footer">
          Gerado em: ${new Date().toLocaleString('pt-BR')}
        </div>
      </body>
      </html>
    `;
    
    this.baixarPDF(conteudo, `receitas_periodo_${Date.now()}.pdf`);
  }

  // Receita por Categoria
  gerarPdfReceitasPorCategoria(dados: ReceitaPorCategoria[]): void {
    const doc = this.criarDocumentoPDF();
    
    const total = dados.reduce((soma, item) => soma + item.receitaTotal, 0);
    dados.forEach(item => {
      item.percentual = (item.receitaTotal / total) * 100;
    });
    dados.sort((a, b) => b.receitaTotal - a.receitaTotal);
    
    const cabecalho = this.criarCabecalho('RELATÓRIO DE RECEITAS POR CATEGORIA');
    const tabela = this.criarTabelaCategorias(dados);
    const grafico = this.criarGraficoCategorias(dados);
    const resumo = this.criarResumoCategorias(dados, total);
    
    const conteudo = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>${this.estilosPDF()}</style>
      </head>
      <body>
        ${cabecalho}
        ${tabela}
        ${grafico}
        ${resumo}
        <div class="footer">
          Gerado em: ${new Date().toLocaleString('pt-BR')}
        </div>
      </body>
      </html>
    `;
    
    this.baixarPDF(conteudo, `receitas_categoria_${Date.now()}.pdf`);
  }

  // Métodos auxiliares
  private agruparReceitasPorDia(dados: any[]): ReceitaPorDia[] {
    const agrupado = new Map<string, ReceitaPorDia>();
    
    dados.forEach(item => {
      const data = new Date(item.paymentDate).toLocaleDateString('pt-BR');
      
      if (!agrupado.has(data)) {
        agrupado.set(data, {
          data: data,
          receitaTotal: 0,
          quantidade: 0,
          detalhes: []
        });
      }
      
      const grupo = agrupado.get(data)!;
      grupo.receitaTotal += item.value;
      grupo.quantidade++;
      grupo.detalhes?.push(item);
    });
    
    return Array.from(agrupado.values()).sort((a, b) => 
      new Date(a.data.split('/').reverse().join('-')).getTime() - 
      new Date(b.data.split('/').reverse().join('-')).getTime()
    );
  }

  private criarDocumentoPDF(): any {
    return { titulo: '', conteudo: '' };
  }

  private criarCabecalho(titulo: string): string {
    return `
      <div class="header">
        <h1>${titulo}</h1>
        <p>Sistema de Controle de Manutenção de Equipamentos</p>
      </div>
    `;
  }

  private criarInfoPeriodo(dataInicio?: string, dataFim?: string): string {
    let periodo = 'Período: ';
    if (dataInicio && dataFim) {
      periodo += `${this.formatarData(dataInicio)} até ${this.formatarData(dataFim)}`;
    } else if (dataInicio) {
      periodo += `A partir de ${this.formatarData(dataInicio)}`;
    } else if (dataFim) {
      periodo += `Até ${this.formatarData(dataFim)}`;
    } else {
      periodo += 'Todos os períodos';
    }
    
    return `<div class="period-info">${periodo}</div>`;
  }

  private criarTabelaReceitas(dados: ReceitaPorDia[]): string {
    const linhas = dados.map(item => `
      <tr>
        <td>${item.data}</td>
        <td class="center">${item.quantidade}</td>
        <td class="right">R$ ${this.formatarMoeda(item.receitaTotal)}</td>
      </tr>
    `).join('');
    
    return `
      <table>
        <thead>
          <tr>
            <th>Data</th>
            <th class="center">Quantidade de Serviços</th>
            <th class="right">Receita Total</th>
          </tr>
        </thead>
        <tbody>
          ${linhas}
        </tbody>
      </table>
    `;
  }

  private criarTabelaCategorias(dados: ReceitaPorCategoria[]): string {
    const linhas = dados.map(item => `
      <tr>
        <td>${item.categoria}</td>
        <td class="center">${item.quantidade}</td>
        <td class="right">R$ ${this.formatarMoeda(item.receitaTotal)}</td>
        <td class="center">${item.percentual?.toFixed(1)}%</td>
      </tr>
    `).join('');
    
    return `
      <table>
        <thead>
          <tr>
            <th>Categoria</th>
            <th class="center">Quantidade</th>
            <th class="right">Receita Total</th>
            <th class="center">Percentual</th>
          </tr>
        </thead>
        <tbody>
          ${linhas}
        </tbody>
      </table>
    `;
  }

  private criarGraficoCategorias(dados: ReceitaPorCategoria[]): string {
    const larguraMax = 400;
    const valorMax = Math.max(...dados.map(d => d.receitaTotal));
    
    const barras = dados.slice(0, 5).map(item => {
      const largura = (item.receitaTotal / valorMax) * larguraMax;
      return `
        <div class="chart-bar">
          <div class="bar-label">${item.categoria}</div>
          <div class="bar-container">
            <div class="bar" style="width: ${largura}px;">
              R$ ${this.formatarMoeda(item.receitaTotal)}
            </div>
          </div>
        </div>
      `;
    }).join('');
    
    return `
      <div class="chart">
        <h3>Top 5 Categorias por Receita</h3>
        ${barras}
      </div>
    `;
  }

  private criarResumoReceitas(dados: ReceitaPorDia[]): string {
    const total = dados.reduce((soma, item) => soma + item.receitaTotal, 0);
    const quantidade = dados.reduce((soma, item) => soma + item.quantidade, 0);
    const media = quantidade > 0 ? total / quantidade : 0;
    
    return `
      <div class="summary">
        <h3>Resumo</h3>
        <div class="summary-grid">
          <div class="summary-item">
            <span class="label">Total de Dias:</span>
            <span class="value">${dados.length}</span>
          </div>
          <div class="summary-item">
            <span class="label">Total de Serviços:</span>
            <span class="value">${quantidade}</span>
          </div>
          <div class="summary-item">
            <span class="label">Receita Total:</span>
            <span class="value">R$ ${this.formatarMoeda(total)}</span>
          </div>
          <div class="summary-item">
            <span class="label">Ticket Médio:</span>
            <span class="value">R$ ${this.formatarMoeda(media)}</span>
          </div>
        </div>
      </div>
    `;
  }

  private criarResumoCategorias(dados: ReceitaPorCategoria[], total: number): string {
    const quantidade = dados.reduce((soma, item) => soma + item.quantidade, 0);
    const media = quantidade > 0 ? total / quantidade : 0;
    
    return `
      <div class="summary">
        <h3>Resumo Geral</h3>
        <div class="summary-grid">
          <div class="summary-item">
            <span class="label">Total de Categorias:</span>
            <span class="value">${dados.length}</span>
          </div>
          <div class="summary-item">
            <span class="label">Total de Serviços:</span>
            <span class="value">${quantidade}</span>
          </div>
          <div class="summary-item">
            <span class="label">Receita Total:</span>
            <span class="value">R$ ${this.formatarMoeda(total)}</span>
          </div>
          <div class="summary-item">
            <span class="label">Ticket Médio:</span>
            <span class="value">R$ ${this.formatarMoeda(media)}</span>
          </div>
        </div>
      </div>
    `;
  }

  private estilosPDF(): string {
    return `
      body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
      .header { text-align: center; border-bottom: 2px solid #2563eb; padding-bottom: 20px; margin-bottom: 30px; }
      h1 { color: #1e40af; margin: 0; }
      .period-info { font-size: 14px; color: #666; margin-bottom: 20px; }
      table { width: 100%; border-collapse: collapse; margin: 20px 0; }
      th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
      th { background-color: #f3f4f6; font-weight: bold; color: #374151; }
      .center { text-align: center; }
      .right { text-align: right; }
      .summary { margin-top: 40px; padding: 20px; background-color: #f9fafb; border-radius: 8px; }
      .summary h3 { color: #1f2937; margin-top: 0; }
      .summary-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; }
      .summary-item { display: flex; justify-content: space-between; }
      .label { font-weight: 500; }
      .value { color: #2563eb; font-weight: bold; }
      .chart { margin: 30px 0; }
      .chart-bar { margin: 10px 0; }
      .bar-label { font-size: 12px; margin-bottom: 5px; }
      .bar-container { background-color: #e5e7eb; height: 30px; position: relative; }
      .bar { background-color: #3b82f6; height: 100%; color: white; display: flex; align-items: center; padding: 0 10px; font-size: 11px; }
      .footer { margin-top: 50px; text-align: center; font-size: 12px; color: #9ca3af; }
    `;
  }

  private formatarData(data: string): string {
    return new Date(data).toLocaleDateString('pt-BR');
  }

  private formatarMoeda(valor: number): string {
    return valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  private baixarPDF(conteudo: string, nomeArquivo: string): void {
    const blob = new Blob([conteudo], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    const janela = window.open(url, '_blank');
    if (janela) {
      janela.onload = () => {
        janela.print();
      };
    }
  }
}
