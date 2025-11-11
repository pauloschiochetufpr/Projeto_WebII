import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';

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
  private apiUrl = 'http://localhost:8080/api'; // URL do backend Spring Boot

  constructor(private http: HttpClient) {}

  // ===== RF019: Receita por Período =====
  obterReceitasPorPeriodo(dataInicio?: string, dataFim?: string): Observable<ReceitaPorDia[]> {
    let params: any = {};
    if (dataInicio) params.startDate = dataInicio;
    if (dataFim) params.endDate = dataFim;

    return this.http.get<any[]>(`${this.apiUrl}/reports/revenue-by-period`, { params })
      .pipe(map(dados => this.agruparReceitasPorDia(dados)));
  }

  // ===== RF020: Receita por Categoria =====
  obterReceitasPorCategoria(): Observable<ReceitaPorCategoria[]> {
    return this.http.get<ReceitaPorCategoria[]>(`${this.apiUrl}/reports/revenue-by-category`);
  }

  // ===== Geração de PDF - NOVO =====
  baixarPdfReceitasPorPeriodo(dataInicio?: string, dataFim?: string): Observable<Blob> {
    let params = new HttpParams();
    if (dataInicio) params = params.set('startDate', dataInicio);
    if (dataFim) params = params.set('endDate', dataFim);

    return this.http.get(`${this.apiUrl}/reports/revenue-by-period/pdf`, {
      params,
      responseType: 'blob'
    });
  }

  baixarPdfReceitasPorCategoria(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/reports/revenue-by-category/pdf`, {
      responseType: 'blob'
    });
  }

  // ===== Métodos auxiliares =====
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
}
