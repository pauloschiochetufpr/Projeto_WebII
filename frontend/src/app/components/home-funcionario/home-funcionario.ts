import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { catchError, of, Subscription, take } from 'rxjs';
import { JsonTestService, User } from '../../services/jsontest';

import { FuncHeader } from '../func-header/func-header';
import { DateSelection } from '../../services/date-selection';
import { SolicitacaoService } from '../../services/solicitacao';
import { VisualizarServicosDialog } from '../../components/visualizar-servico-dialog/visualizar-servicos-dialog';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

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

  private sub = new Subscription();

  //ids de status
  statusMapById: Record<number, string> = {
    1: 'ABERTA',
    2: 'ORÇADA',
    3: 'REJEITADA',
    4: 'APROVADA',
    5: 'REDIRECIONADA',
    6: 'ARRUMADA',
    7: 'PAGA',
    8: 'FINALIZADA',
    9: 'CANCELADA',
  };

  constructor(
    private solicitacaoService: SolicitacaoService,
    private jsonService: JsonTestService,
    public dateSelection: DateSelection,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadAbertoFromBackend();
  }

  private loadAbertoFromBackend(): void {
    this.loading = true;
    this.error = null;

    // 1 = ABERTA (conforme map)
    const sub = this.solicitacaoService
      .listarTodasComLastUpdate()
      .pipe(
        take(1),
        catchError((err) => {
          console.warn(
            'Backend indisponível ou erro ao buscar por status. Usando mock.',
            err
          );
          // fallback: usar o jsonService local (retornamos empty observable aqui;
          // tratamos fazendo load do mock abaixo)
          return of(null);
        })
      )
      .subscribe({
        next: (arr) => {
          if (arr === null) {
            // fallback para o mock local
            this.loadFromMock();
            return;
          }

          const all = (arr || []).map((d) => this.normalize(d));
          // já chegam apenas ABERTA (backend), mas filtramos por segurança:
          this.solicitations = all.filter(
            (item) => this.getStatus(item) === 'ABERTA'
          );

          // ordenar crescente por data/hora
          this.solicitations.sort((a, b) => {
            const da =
              this.parseDateString(this.getDateString(a))?.getTime() ?? 0;
            const db =
              this.parseDateString(this.getDateString(b))?.getTime() ?? 0;
            return da - db;
          });

          this.loading = false;
        },
        error: (err) => {
          console.error(
            'Erro carregando solicitações (funcionario) — subscribe',
            err
          );
          this.error = 'Erro ao carregar solicitações';
          this.loading = false;
        },
      });

    this.sub.add(sub);
  }

  private loadFromMock(): void {
    // subscreve ao BehaviorSubject do mock e filtra ABERTA
    const s = this.jsonService.users$.subscribe({
      next: (arr) => {
        const all = (arr || []).map((d) => this.normalize(d));
        this.solicitations = all.filter(
          (item) => this.getStatus(item) === 'ABERTA'
        );

        // ordenar crescente por data/hora
        this.solicitations.sort((a, b) => {
          const da =
            this.parseDateString(this.getDateString(a))?.getTime() ?? 0;
          const db =
            this.parseDateString(this.getDateString(b))?.getTime() ?? 0;
          return da - db;
        });

        this.loading = false;
      },
      error: (err) => {
        console.error('Erro carregando mock de solicitações', err);
        this.error = 'Erro ao carregar solicitações';
        this.loading = false;
      },
    });

    this.sub.add(s);
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  // normaliza payload vindo do JSON para o formato usado aqui
  normalize(d: any): Solicitation {
    return {
      idSolicitacao:
        d.idSolicitacao ?? (typeof d.id === 'number' ? d.id : undefined),
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
    if (s.idStatus && this.statusMapById[s.idStatus])
      return this.statusMapById[s.idStatus];
    return 'Desconhecido';
  }
}
