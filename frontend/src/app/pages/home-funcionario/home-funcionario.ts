import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { JsonTestService, User } from '../../services/jsontest';

import { FuncHeader } from '../../components/func-header/func-header';
import { DateSelection } from '../../services/date-selection';

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
  [key: string]: any;
}

@Component({
  selector: 'app-home-funcionario',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, FuncHeader],
  templateUrl: './home-funcionario.html',
  styleUrls: ['./home-funcionario.css'],
})
export class HomeFuncionarioComponent implements OnInit, OnDestroy {
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
    private jsonService: JsonTestService,
    public dateSelection: DateSelection
  ) {}

  ngOnInit(): void {
    this.loading = true;
    const s = this.jsonService.users$.subscribe({
      next: (arr) => {
        const all = (arr || []).map((d) => this.normalize(d));
        // filtra apenas ABERTA
        this.solicitations = all.filter(
          (item) => this.getStatus(item) === 'ABERTA'
        );
        // ordena crescente por data/hora
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
        console.error('Erro carregando solicitações (funcionario)', err);
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
