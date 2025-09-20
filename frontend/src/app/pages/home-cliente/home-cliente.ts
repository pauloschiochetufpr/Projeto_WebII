import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { JsonTestService } from '../../services/jsontest'; // Mudar para o banco de dados quando fizermos o backend
import { DateSelection } from '../../services/date-selection';

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
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './home-cliente.html',
  styleUrl: './home-cliente.css',
})
export class HomeCliente implements OnInit, OnDestroy {
  solicitations: Solicitation[] = [];
  loading = false;
  error: string | null = null;

  // item selecionado para visualizar
  selected: Solicitation | null = null;

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
    private dateSelection: DateSelection
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

  // verifica se pode cancelar
  canCancel(s: Solicitation): boolean {
    const status = this.getStatus(s);
    return !['ARRUMADA', 'PAGA', 'FINALIZADA', 'CANCELADA'].includes(status);
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

  // abrir visualização
  view(s: Solicitation) {
    this.selected = s;
    console.log('Visualizar solicitação', s);
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

  approve(s: Solicitation) {
    // Orçada -> Aprovada (ex.: id 4)
    this.updateStatusRemote(s, 'APROVADA', 4, 'CLIENTE');
  }

  reject(s: Solicitation) {
    // Orçada -> Rejeitada (ex.: id 3)
    this.updateStatusRemote(s, 'REJEITADA', 3, 'CLIENTE');
  }

  //resgatar de CANCELADA -> ABERTA
  rescueFromCancelled(s: Solicitation) {
    const ok = window.confirm(
      'Deseja resgatar esta solicitação e reabrí-la (ABERTA)?'
    );
    if (!ok) return;
    this.updateStatusRemote(s, 'ABERTA', 1, 'CLIENTE');
  }

  //resgatar de REJEITADA -> ORÇADA
  rescueFromRejected(s: Solicitation) {
    this.updateStatusRemote(s, 'ORÇADA', 2, 'CLIENTE');
  }

  pay(s: Solicitation) {
    this.updateStatusRemote(s, 'PAGA', 7, 'CLIENTE');
  }

  // cancelar (com confirmação)
  cancel(s: Solicitation) {
    if (!this.canCancel(s)) return;
    const ok = window.confirm('Deseja cancelar esta solicitação?');
    if (!ok) return;
    this.updateStatusRemote(s, 'CANCELADA', 9, 'CLIENTE');
  }

  // decidir quais botões mostrar
  showActionsFor(s: Solicitation) {
    const status = this.getStatus(s);
    return {
      showApproveReject: status === 'ORÇADA',
      showRescueRejeitada: status === 'REJEITADA',
      showPay: status === 'ARRUMADA',
      showCancel: !['ARRUMADA', 'PAGA', 'FINALIZADA', 'CANCELADA'].includes(
        status
      ),
      showRescueCancelled: status === 'CANCELADA',
    };
  }

  // função util para formatar a data exibida
  formatDateDisplay(s: Solicitation): string {
    const d = this.parseDateString(this.getDateString(s));
    return d ? d.toLocaleString() : '-';
  }
}
