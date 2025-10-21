import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RelatorioService, ReceitaPorDia } from '../../services/relatorio'; 
import { finalize } from 'rxjs/operators';

interface ReceitaPorDiaComUI extends ReceitaPorDia {
  showDetails?: boolean;
}

@Component({
  selector: 'app-receita-por-periodo',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './gerar-relatorio.html',
  styles: [`
    /* tem que usar o padrão que o cena mandou */
  `]
})
export class ReceitaPorPeriodoComponent implements OnInit {
  filterForm: FormGroup;
  reportData: ReceitaPorDiaComUI[] = []; 
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
      .pipe(
        finalize(() => this.loading = false)
      )
      .subscribe({
        next: (data: ReceitaPorDia[]) => {
          this.reportData = data.map(item => ({ ...item, showDetails: false }));
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
    this.totalRevenue = this.reportData.reduce((sum, item) => sum + item.receitaTotal, 0);
    this.totalServices = this.reportData.reduce((sum, item) => sum + item.quantidade, 0);
    this.averageTicket = this.totalServices > 0 ? this.totalRevenue / this.totalServices : 0;
  }

  toggleDetails(item: ReceitaPorDiaComUI): void {
    item.showDetails = !item.showDetails;
  }

  exportToPDF(): void {
    const { dataInicio, dataFim } = this.filterForm.value;
    this.relatorioService.gerarPdfReceitasPorPeriodo(this.reportData, dataInicio, dataFim);
  }

  formatCurrency(value: number): string {
    return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  private formatDateForInput(date: Date): string {
    return date.toISOString().split('T')[0];
  }
}