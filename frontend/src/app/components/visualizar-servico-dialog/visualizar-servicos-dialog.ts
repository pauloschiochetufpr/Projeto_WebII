import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SolicitacaoService } from '../../services/solicitacao';

export interface HistoryStep {
  state: string;
  date: string;
  by: string;
  note?: string;
}

export interface Solicitation {
  id?: number | string;
  requesterName?: string;
  description?: string;
  createdAt?: string;
  state?: string;
  redirectDestinationName?: string;
  budget?: number;
  history?: HistoryStep[];
  // campos extra vindos do backend
  idSolicitacao?: number;
  idCliente?: number;
  idCategoria?: number;
  idStatus?: number;
  valor?: number;
  ativo?: boolean;
  cliente?: { nome?: string };
}

@Component({
  selector: 'app-visualizar-servico-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './visualizar-servicos-dialog.html',
  styleUrls: ['./visualizar-servicos-dialog.css'],
})
export class VisualizarServicosDialog implements OnInit {
  descricaoManutencao: string = '';
  orientacoesCliente: string = '';

  constructor(
    public dialogRef: MatDialogRef<VisualizarServicosDialog>,
    @Inject(MAT_DIALOG_DATA)
    public data: { user: Solicitation; currentDestination: string },
    private solicitacaoService: SolicitacaoService
  ) {}

  ngOnInit(): void {
    this.carregarHistorico();
  }

  // Carregar histórico de uma solicitação
  carregarHistorico(): void {
    if (!this.data.user.id) return;

    const idNum = Number(this.data.user.id);
    if (isNaN(idNum)) {
      this.data.user.history = [];
      return;
    }

    this.solicitacaoService.getHistorico(idNum).subscribe({
      next: (hist: any[]) => {
        this.data.user.history = (hist || []).map((h: any) => ({
          date: h.dataHora,
          state: h.statusNew || '',
          by: h.funcionarioNew
            ? `Funcionário #${h.funcionarioNew}`
            : h.cliente
            ? 'Cliente'
            : 'Sistema',
          note: h.statusOld ? `De ${h.statusOld}` : undefined,
        }));
      },
      error: (err: any) => {
        console.error('Erro ao carregar histórico:', err);
        this.data.user.history = [];
      },
    });
  }

  // Efetuar Orçamento — usa PUT (atualizarSolicitacao) para enviar valor + mudar status para ORÇADA
  efetuarOrcamento() {
    const valor = prompt('Digite o valor do orçamento:');
    if (!valor) return;

    const novoValor = parseFloat(valor.replace(',', '.'));
    if (isNaN(novoValor)) {
      alert('Valor inválido');
      return;
    }

    const id = Number(this.data.user.id);
    if (isNaN(id)) {
      alert('ID da solicitação inválido');
      return;
    }

    this.solicitacaoService.buscarPorId(id).subscribe({
      next: (solicitacao: any) => {
        const dto: any = {
          idSolicitacao: solicitacao.idSolicitacao ?? id,
          nome: solicitacao.nome,
          descricao: solicitacao.descricao,
          idCliente: solicitacao.idCliente ?? solicitacao.cliente?.idCliente ?? null,
          valor: novoValor,
          idStatus: 2, // ORÇADA
          idCategoria: solicitacao.idCategoria,
          ativo: solicitacao.ativo ?? true,
        };

        this.solicitacaoService.atualizarSolicitacao(id, dto).subscribe({
          next: (res: any) => {
            // atualiza view local
            this.data.user.budget = res?.valor ?? novoValor;
            this.data.user.state = 'ORÇADA';
            // fecha dialog retornando ação para o caller
            this.dialogRef.close({ action: 'ORÇAR', user: this.data.user, budget: this.data.user.budget });
          },
          error: (err: any) => {
            console.error('Erro ao orçar:', err);
            alert('Erro ao orçar: ' + (err?.message ?? 'Erro no servidor'));
          },
        });
      },
      error: (err: any) => {
        console.error('Erro ao buscar solicitação antes de orçar:', err);
        alert('Erro ao buscar solicitação: ' + (err?.message ?? 'Erro no servidor'));
      },
    });
  }

  // Resgatar serviço rejeitado
  resgatar() {
    this.solicitacaoService
      .atualizarStatus(Number(this.data.user.id), 3, false)
      .subscribe({
        next: () => {
          this.data.user.state = 'APROVADA';
          this.dialogRef.close({ action: 'RESGATAR', user: this.data.user });
        },
        error: (err: any) => alert('Erro ao resgatar: ' + (err?.message ?? err)),
      });
  }

  // Efetuar Manutenção
  registrarManutencao() {
    this.solicitacaoService
      .atualizarStatus(Number(this.data.user.id), 5, false)
      .subscribe({
        next: () => {
          this.data.user.state = 'ARRUMADA';
          this.dialogRef.close({
            action: 'ARRUMAR',
            user: this.data.user,
            descricao: this.descricaoManutencao,
            orientacoes: this.orientacoesCliente,
          });
        },
        error: (err: any) => alert('Erro ao registrar manutenção: ' + (err?.message ?? err)),
      });
  }

  // Redirecionar Manutenção
  redirecionar() {
    const destino = prompt('Digite o destino para redirecionamento:');
    if (!destino) return;

    // aqui você pode enviar funcionarioId se tiver (adaptar backend)
    this.solicitacaoService
      .atualizarStatus(Number(this.data.user.id), 8, false)
      .subscribe({
        next: () => {
          this.data.user.state = 'REDIRECIONADA';
          this.data.user.redirectDestinationName = destino;
          this.dialogRef.close({
            action: 'REDIRECIONAR',
            user: this.data.user,
            destino,
          });
        },
        error: (err: any) => alert('Erro ao redirecionar: ' + (err?.message ?? err)),
      });
  }

  // Pagar Serviço
  pagar() {
    this.solicitacaoService
      .atualizarStatus(Number(this.data.user.id), 6, false)
      .subscribe({
        next: () => {
          this.data.user.state = 'PAGA';
          this.dialogRef.close({ action: 'PAGAR', user: this.data.user });
        },
        error: (err: any) => alert('Erro ao pagar: ' + (err?.message ?? err)),
      });
  }

  // Finalizar Solicitação
  finalizar() {
    this.solicitacaoService
      .atualizarStatus(Number(this.data.user.id), 7, false)
      .subscribe({
        next: () => {
          this.data.user.state = 'FINALIZADA';
          this.dialogRef.close({ action: 'FINALIZAR', user: this.data.user });
        },
        error: (err: any) => alert('Erro ao finalizar: ' + (err?.message ?? err)),
      });
  }

  close() {
    this.dialogRef.close();
  }

  // Redirecionar para si mesmo
  redirecionarParaMim() {
    const destino = this.data.currentDestination;
    this.solicitacaoService
      .atualizarStatus(Number(this.data.user.id), 8, false)
      .subscribe({
        next: () => {
          this.data.user.state = 'REDIRECIONADA';
          this.data.user.redirectDestinationName = destino;
          this.dialogRef.close({
            action: 'REDIRECIONAR',
            user: this.data.user,
            destino,
          });
        },
        error: (err: any) =>
          alert('Erro ao redirecionar para si mesmo: ' + (err?.message ?? err)),
      });
  }

  get diasDesdeAbertura(): number | null {
    if (!this.data?.user?.createdAt) return null;
    const created = new Date(this.data.user.createdAt);
    if (isNaN(created.getTime())) return null;

    const diffMs = Date.now() - created.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  trackHistory(index: number, item: any) {
    return item?.id ?? index;
  }
}
