import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { finalize } from 'rxjs/operators';

// Ajuste o caminho conforme sua estrutura (se services está em src/app/services)
import { RelatorioService, ReceitaPorDia } from '../../services/relatorio.service';

@Component({
  selector: 'app-relatorio-periodo', // Nome do seletor atualizado
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './relatorio-periodo.html' // Aponta para o HTML desta mesma pasta
})
export class ReceitaPorPeriodoComponent implements OnInit {
  filterForm: FormGroup;
  reportData: ReceitaPorDia[] = [];
  loading = false;
  searched = false;

  totalRevenue = 0;
  totalServices = 0;
  averageTicket = 0;

  constructor(
    private fb: FormBuilder,
    private relatorioService: RelatorioService
  ) {
    this.filterForm = this.fb.group({
      dataInicio: [''],
      dataFim: ['']
    });
  }

  ngOnInit(): void {
    this.initializeFormWithCurrentMonth();
    this.loadReport();
  }

  private initializeFormWithCurrentMonth(): void {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    this.filterForm.patchValue({
      dataInicio: this.formatDateForInput(firstDay),
      dataFim: this.formatDateForInput(lastDay)
    });
  }

  loadReport(): void {
    this.loading = true;
    this.searched = false;
    const { dataInicio, dataFim } = this.filterForm.value;

    this.relatorioService.obterReceitasPorPeriodo(dataInicio, dataFim)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (data: ReceitaPorDia[]) => {
          this.reportData = data;
          this.calculateSummary();
          this.searched = true;
        },
        error: (error) => {
          console.error('Erro ao carregar relatório:', error);
          this.reportData = [];
          this.searched = true;
        }
      });
  }

  private calculateSummary(): void {
    // Usando nomes das propriedades compatíveis com o DTO Java
    this.totalRevenue = this.reportData.reduce((sum, item) => sum + item.valorTotal, 0);
    this.totalServices = this.reportData.reduce((sum, item) => sum + item.quantidadeSolicitacoes, 0);
    
    this.averageTicket = this.totalServices > 0
      ? this.totalRevenue / this.totalServices
      : 0;
  }

  exportToPDF(): void {
    const { dataInicio, dataFim } = this.filterForm.value;
    
    this.relatorioService.baixarPdfReceitasPorPeriodo(dataInicio, dataFim)
      .subscribe({
        next: (pdfBlob: Blob) => {
          const blobUrl = window.URL.createObjectURL(pdfBlob);
          const a = document.createElement('a');
          a.href = blobUrl;
          a.download = `relatorio_receitas_${dataInicio || 'inicio'}_${dataFim || 'fim'}.pdf`;
          a.click();
          window.URL.revokeObjectURL(blobUrl);
        },
        error: (err) => console.error('Erro ao baixar PDF:', err)
      });
  }

  formatCurrency(value: number): string {
    return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  private formatDateForInput(date: Date): string {
    return date.toISOString().split('T')[0];
  }
}