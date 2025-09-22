import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { JsonTestService } from '../../services/jsontest';
import { DateSelection } from '../../services/date-selection';
import { VisualizarServicoClienteDialog } from '../../components/visualizar-servico-cliente/visualizar-servico-cliente';

export interface Solicitation {
  idSolicitacao?: number;
  id?: number | string;
  idCliente?: number;
  nome?: string;
  name?: string;
  descricao?: string;
  description?: string;
  dataHora?: string;
  createdAt?: string;
  date?: string;
  idStatus?: number;
  state?: string;
  valor?: number;
  [key: string]: any;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatDialogModule],
  templateUrl: './home-cliente.html',
  styleUrl: './home-cliente.css',
})
export class HomeCliente implements OnInit, OnDestroy {
  solicitations: Solicitation[] = [];
  loading = false;
  error: string | null = null;

  private sub = new Subscription();

  // ids de status
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
    private dateSelection: DateSelection,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loading = true;
    const s = this.jsonService.users$.subscribe({
      next: (arr) => {
        this.solicitations = (arr || []).map((d) => this.normalize(d));
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
        console.error('Erro ao carregar solicitações', err);
        this.error = 'Erro ao carregar solicitações';
        this.loading = false;
      },
    });
    this.sub.add(s);
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  normalize(d: any): Solicitation {
    return {
      idSolicitacao:
        d.idSolicitacao ?? (typeof d.id === 'number' ? d.id : undefined),
      id: d.id ?? d.idSolicitacao,
      nome: d.nome ?? d.requesterName ?? d.name,
      descricao: d.descricao ?? d.description,
      dataHora: d.dataHora ?? d.createdAt ?? d.date,
      idStatus: d.idStatus,
      state: d.state ?? d.statusName ?? null,
      valor: d.valor ?? d.value,
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

  getName(s: Solicitation): string {
    return (s.nome ?? s.name ?? '—') as string;
  }

  truncateName(s: Solicitation, max = 30) {
    const n = this.getName(s);
    return n.length > max ? n.slice(0, max - 1) + '…' : n;
  }

  getStatus(s: Solicitation): string {
    if (s.state) return s.state;
    if (s.idStatus && this.statusMapById[s.idStatus])
      return this.statusMapById[s.idStatus];
    return 'Desconhecido';
  }

  // ----------------- Ações -----------------

  // abrir dialog de visualização (RF008 + demais RFs do cliente)
  view(s: Solicitation) {
    const ref = this.dialog.open(VisualizarServicoClienteDialog, {
      width: '600px',
      data: s,
    });

    ref.afterClosed().subscribe((result) => {
      if (!result) return;
      this.updateStatusRemote(
        s,
        result.newStatusName,
        result.newStatusId,
        'CLIENTE'
      );
    });
  }

  // atualizar o status localmente e simular chamada ao backend
  private updateStatusRemote(
    s: Solicitation,
    newStatusName: string,
    newStatusId?: number,
    actor: 'CLIENTE' | 'FUNCIONARIO' | 'SYSTEM' = 'CLIENTE'
  ) {
    const id = s.idSolicitacao ?? s.id;
    if (id === undefined) {
      console.error('Solicitação sem ID, não é possível atualizar status', s);
      return;
    }

    this.jsonService
      .updateStatus(id, newStatusId, newStatusName, actor)
      .subscribe({
        next: (updated) => console.log('Status atualizado (mock):', updated),
        error: (err) => console.error('Erro ao atualizar status (mock):', err),
      });
  }

  // função util para formatar a data exibida
  formatDateDisplay(s: Solicitation): string {
    const d = this.parseDateString(this.getDateString(s));
    return d ? d.toLocaleString() : '-';
  }
}
