import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms'; 
import { RouterModule } from '@angular/router';
import { catchError, of, Subscription, take, finalize } from 'rxjs';
import { JsonTestService } from '../../services/jsontest';
import { FuncHeader } from '../func-header/func-header';
import { DateSelection } from '../../services/date-selection';
import { SolicitacaoService } from '../../services/solicitacao';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { RelatorioService } from '../../services/relatorio.service'; 

export interface Solicitation {
  idSolicitacao?: number;
  id?: number | string;
  idCliente?: number;
  nome?: string;
  requesterName?: string;
  descricao?: string;
  description?: string;
  dataHora?: string;
  createdAt?: string;
  date?: string;
  idStatus?: number;
  state?: string;
  lastUpdate?: string | null;
  [key: string]: any;
}

@Component({
  selector: 'app-home-funcionario',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule, 
    RouterModule,
    FuncHeader,
    MatDialogModule,
  ],
  templateUrl: './home-funcionario.html',
  styleUrls: ['./home-funcionario.css'],
})
export class HomeFuncionario implements OnInit, OnDestroy {
  solicitations: Solicitation[] = [];
  loading = false;
  error: string | null = null;
  isModalOpen = false;
  activeTab: 'periodo' | 'categoria' = 'periodo';
  formPeriodo: FormGroup;
  loadingReport = false; 

  private sub = new Subscription();

  statusMapById: Record<number, string> = {
    1: 'ABERTA', 2: 'ORÇADA', 3: 'REJEITADA', 4: 'APROVADA',
    5: 'REDIRECIONADA', 6: 'ARRUMADA', 7: 'PAGA', 8: 'FINALIZADA', 9: 'CANCELADA',
  };

  constructor(
    private solicitacaoService: SolicitacaoService,
    private jsonService: JsonTestService,
    public dateSelection: DateSelection,
    private dialog: MatDialog,
    private relatorioService: RelatorioService,
    private fb: FormBuilder 
  ) {
    this.formPeriodo = this.fb.group({
      dataInicio: ['', Validators.required],
      dataFim: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadAbertoFromBackend();
    this.initializeReportDates();
  }
  private loadAbertoFromBackend(): void {
    this.loading = true;
    this.error = null;

    const sub = this.solicitacaoService.listarTodasComLastUpdate()
      .pipe(
        take(1),
        catchError((err) => {
          console.warn('Backend indisponível. Usando mock.', err);
          return of(null);
        })
      )
      .subscribe({
        next: (arr) => {
          if (arr === null) {
            this.loadFromMock();
            return;
          }
          const all = (arr || []).map((d) => this.normalize(d));
          this.solicitations = all.filter((item) => this.getStatus(item) === 'ABERTA');
          this.sortSolicitations();
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Erro ao carregar solicitações';
          this.loading = false;
        },
      });
    this.sub.add(sub);
  }

  private loadFromMock(): void {
    const s = this.jsonService.users$.subscribe({
      next: (arr) => {
        const all = (arr || []).map((d) => this.normalize(d));
        this.solicitations = all.filter((item) => this.getStatus(item) === 'ABERTA');
        this.sortSolicitations();
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erro ao carregar solicitações';
        this.loading = false;
      },
    });
    this.sub.add(s);
  }

  initializeReportDates(): void {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];

    this.formPeriodo.patchValue({
      dataInicio: firstDay,
      dataFim: lastDay
    });
  }

  openReportModal() { this.isModalOpen = true; }
  closeReportModal() { this.isModalOpen = false; }
  switchTab(tab: 'periodo' | 'categoria') { this.activeTab = tab; }

  baixarRelatorio() {
    this.loadingReport = true;

    if (this.activeTab === 'periodo') {
      if (this.formPeriodo.invalid) return;
      const { dataInicio, dataFim } = this.formPeriodo.value;
      
      this.relatorioService.baixarPdfReceitasPorPeriodo(dataInicio, dataFim)
        .pipe(finalize(() => this.loadingReport = false))
        .subscribe({
          next: (blob) => this.downloadFile(blob, `relatorio_periodo.pdf`),
          error: (err) => console.error('Erro ao baixar PDF Período', err)
        });
    } else {
      this.relatorioService.baixarPdfReceitasPorCategoria()
        .pipe(finalize(() => this.loadingReport = false))
        .subscribe({
          next: (blob) => this.downloadFile(blob, `relatorio_categoria.pdf`),
          error: (err) => console.error('Erro ao baixar PDF Categoria', err)
        });
    }
  }

  private downloadFile(blob: Blob, fileName: string) {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
    this.closeReportModal();
  }

  private sortSolicitations() {
    this.solicitations.sort((a, b) => {
      const da = this.parseDateString(this.getDateString(a))?.getTime() ?? 0;
      const db = this.parseDateString(this.getDateString(b))?.getTime() ?? 0;
      return da - db;
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  normalize(d: any): Solicitation {
    return {
      idSolicitacao: d.idSolicitacao ?? (typeof d.id === 'number' ? d.id : undefined),
      id: d.id ?? d.idSolicitacao,
      nome: d.nome ?? d.requesterName ?? d.name,
      requesterName: d.requesterName ?? d.nome ?? d.name,
      descricao: d.descricao ?? d.description,
      dataHora: d.dataHora ?? d.createdAt ?? d.date,
      idStatus: d.idStatus,
      state: d.state ?? d.statusName ?? null,
      ...d,
    };
  }

  getDateString(s: Solicitation): string | null {
    return s.dataHora ?? s.createdAt ?? s.date ?? null;
  }

  parseDateString(str: string | null): Date | null {
    if (!str) return null;
    const d = new Date(str);
    return isNaN(d.getTime()) ? null : d;
  }

  getClientName(s: Solicitation): string {
    return (s.nome ?? s.requesterName ?? '—') as string;
  }

  getDescriptionTruncated(s: Solicitation, max = 30): string {
    const desc = (s.descricao ?? s.description ?? '—') as string;
    return desc.length > max ? desc.slice(0, max - 1) + '…' : desc;
  }

  getStatus(s: Solicitation): string {
    if (s.state) return s.state;
    if (s.idStatus && this.statusMapById[s.idStatus]) return this.statusMapById[s.idStatus];
    return 'Desconhecido';
  }
}