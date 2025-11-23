import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { DateSelection } from '../../services/date-selection';
import { VisualizarServicoClienteDialog } from '../visualizar-servico-cliente/visualizar-servico-cliente';
import { SolicitacaoService, SolicitacaoDto } from '../../services/solicitacao';
import { jwtDecode } from 'jwt-decode';

export interface Solicitation extends SolicitacaoDto {
  id: number | string;
  state?: string;
  lastUpdate?: string | null;
}

@Component({
  selector: 'app-home-cliente',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatDialogModule],
  templateUrl: './home-cliente.html',
  styleUrl: './home-cliente.css',
})
export class HomeCliente implements OnInit, OnDestroy {
  solicitations: Solicitation[] = [];
  loading = false;
  error: string | null = null;
  id: number | undefined;

  private sub = new Subscription();

  // ids de status mapeamento
  statusMapById: Record<number, string> = {
    1: 'ABERTA',
    2: 'ORÇADA',
    3: 'APROVADA',
    4: 'REJEITADA',
    5: 'ARRUMADA',
    6: 'PAGA',
    7: 'FINALIZADA',
    8: 'REDIRECIONADA',
    9: 'CANCELADA',
  };

  constructor(
    private solicitacaoService: SolicitacaoService,
    public dateSelection: DateSelection,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.extrairDadosDoToken();
    this.carregarSolicitacoes();
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  // carrega do back
  carregarSolicitacoes(): void {
    this.loading = true;

    const clienteId = this.id;

    if (!clienteId) {
      console.error('ID do cliente não encontrado!');
      this.loading = false;
      return;
    }

    const s = this.solicitacaoService
      .listarPorClienteComLastUpdate(clienteId)
      .subscribe({
        next: (arr) => {
          this.solicitations = arr.map((d) => this.normalize(d));
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

  normalize(d: any): Solicitation {
    return {
      idSolicitacao: d.idSolicitacao,
      id: d.idSolicitacao ?? d.id,
      nome: d.nome ?? d.name ?? d.cliente?.nome ?? '—',
      descricao: d.descricao ?? d.description,
      dataHora: d.dataHora ?? d.createdAt,
      idStatus: d.idStatus,
      lastUpate: d.lastUpdate,
      state: this.solicitacaoService.mapStatus(d.idStatus),
      valor: d.valor ?? 0,
      ...d,
    };
  }

  getStatus(s: Solicitation): string {
    if (s.state) return s.state;
    if (s.idStatus && this.statusMapById[s.idStatus])
      return this.statusMapById[s.idStatus];
    return 'Desconhecido';
  }

  // abre o dialog de visualização do cliente
  view(s: Solicitation) {
    const ref = this.dialog.open(VisualizarServicoClienteDialog, {
      width: '600px',
      data: s,
    });

    ref.afterClosed().subscribe((result) => {
      if (!result) return;
      this.atualizarStatus(s, result.newStatusId, result.newStatusName);
      this.carregarSolicitacoes();
    });
  }

  // atualiza o status de uma solicitação
  private atualizarStatus(
    s: Solicitation,
    novoStatusId: number,
    novoStatusNome: string
  ) {
    const id = s.idSolicitacao ?? s.id;
    if (!id) {
      console.error('Solicitação sem ID válido:', s);
      return;
    }

    this.solicitacaoService
      .atualizarStatus(Number(id), novoStatusId)
      .subscribe({
        next: (atualizada) => {
          console.log('Status atualizado com sucesso:', atualizada);

          // Atualiza localmente para refletir na tela
          s.idStatus = atualizada.idStatus;
          s.state = this.solicitacaoService.mapStatus(atualizada.idStatus);

          // Caso o backend devolva o valor atualizado
          if (atualizada.valor) s.valor = atualizada.valor;
        },
        error: (err) => {
          console.error('Erro ao atualizar status:', err);
          alert('Erro ao atualizar status da solicitação.');
        },
      });
  }

  // utilitários
  truncateName(s: Solicitation, max = 30): string {
    const n = s.nome ?? '—';
    return n.length > max ? n.slice(0, max - 1) + '…' : n;
  }

  formatDate(value?: string | number | null, withTime: boolean = true): string {
    return this.dateSelection.formatDateDisplay(value, withTime);
  }


    private extrairDadosDoToken() {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    try {
      const payload: any = jwtDecode(token);

      if (payload?.id) {
        this.id = payload.id;
      }
    } catch (e) {
      console.error('Falha ao decodificar token:', e);
    }
  }
}
