import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JsonTestService } from '../../services/jsontest'; // Mudar para o banco de dados quando fizermos o backend
import { DateSelection } from '../../services/date-selection';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

export interface Solicitation {
  idSolicitacao?: number;
  id?: number | string;
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
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './home-cliente.html',
  styleUrl: './home-cliente.css',
})
export class HomeCliente {
  solicitations: Solicitation[] = [];
  loading = false;
  error: string | null = null;

  // item selecionado para visualizar
  selected: Solicitation | null = null;

  //ids de status
  statusMapById: Record<number, string> = {
    1: 'Orçada',
    2: 'Aprovada',
    3: 'Rejeitada',
    4: 'Arrumada',
    5: 'Paga',
  };

  constructor(
    private jsonService: JsonTestService,
    private dateSelection: DateSelection
  ) {}

  ngOnInit(): void {
    this.loadSolicitations();
  }

  // carrega e normaliza os dados
  loadSolicitations() {
    this.loading = true;
    this.error = null;
    this.jsonService.getUsers().subscribe({
      next: (data: any[]) => {
        this.solicitations = (data || []).map((d) => this.normalize(d));
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
        console.error('Erro ao carregar solicitações', err);
        this.error = 'Erro ao carregar solicitações';
        this.loading = false;
      },
    });
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
  private updateStatusLocal(
    s: Solicitation,
    newStatusName: string,
    newStatusId?: number
  ) {
    const prev = this.getStatus(s);
    if (newStatusId !== undefined) s.idStatus = newStatusId;
    s.state = newStatusName;
    console.log(
      `Histórico: solicitação ${
        s.id ?? s.idSolicitacao
      } - ${prev} -> ${newStatusName}`
    );
    // Fazer aqui a chamada para o backend por service, quando tivermos o backend
  }

  approve(s: Solicitation) {
    // Orçada -> Aprovada
    this.updateStatusLocal(s, 'Aprovada', 2);
  }

  reject(s: Solicitation) {
    // Orçada -> Rejeitada
    this.updateStatusLocal(s, 'Rejeitada', 3);
  }

  rescue(s: Solicitation) {
    // Rejeitada -> Orçada (resgatar)
    this.updateStatusLocal(s, 'Orçada', 1);
  }

  pay(s: Solicitation) {
    // Arrumada -> Paga
    this.updateStatusLocal(s, 'Paga', 5);
  }

  // decidir quais botões mostrar
  showActionsFor(s: Solicitation) {
    const status = this.getStatus(s);
    return {
      showApproveReject: status === 'Orçada',
      showRescue: status === 'Rejeitada',
      showPay: status === 'Arrumada',
    };
  }

  // função util para formatar a data exibida
  formatDateDisplay(s: Solicitation): string {
    const d = this.parseDateString(this.getDateString(s));
    return d ? d.toLocaleString() : '-';
  }
}
