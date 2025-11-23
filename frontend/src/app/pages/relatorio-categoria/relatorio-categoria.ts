import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RelatorioService, ReceitaPorCategoria } from '../../services/relatorio.service'; // Ajuste o caminho do import conforme sua pasta

@Component({
  selector: 'app-relatorio-categoria',
  standalone: true,
  imports: [CommonModule], // Não precisa de ReactiveFormsModule pois não tem formulário
  templateUrl: './relatorio-categoria.html'
})
export class RelatorioCategoriaComponent implements OnInit {
  reportData: ReceitaPorCategoria[] = [];
  loading = false;

  totalRevenue = 0;
  totalServices = 0;

  constructor(private relatorioService: RelatorioService) {}

  ngOnInit(): void {
    this.loadReport();
  }

  loadReport(): void {
    this.loading = true;
    // RF020: Busca todos os dados agrupados por categoria
    this.relatorioService.obterReceitasPorCategoria()
      .subscribe({
        next: (data) => {
          this.reportData = data;
          this.calculateSummary();
          this.loading = false;
        },
        error: (err) => {
          console.error('Erro RF020', err);
          this.loading = false;
        }
      });
  }

  calculateSummary(): void {
    this.totalRevenue = this.reportData.reduce((sum, item) => sum + item.receitaTotal, 0);
    this.totalServices = this.reportData.reduce((sum, item) => sum + item.quantidade, 0);
  }

  exportToPDF(): void {
    this.relatorioService.baixarPdfReceitasPorCategoria().subscribe({
      next: (pdfBlob) => {
        const url = window.URL.createObjectURL(pdfBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'relatorio_receita_categoria.pdf';
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => console.error('Erro download PDF', err)
    });
  }

  formatCurrency(value: number): string {
    return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
}