import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Solicitation } from '../../models/solicitacao.model';
import { SolicitacaoService } from '../../services/solicitacao';

@Component({
  selector: 'app-visualizar-servico-cliente-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './visualizar-servico-cliente.html',
})
export class VisualizarServicoClienteDialog {
  loading = false;
  error: string | null = null;

  constructor(
    public dialogRef: MatDialogRef<VisualizarServicoClienteDialog>,
    @Inject(MAT_DIALOG_DATA) public data: Solicitation,
    private solicitacaoService: SolicitacaoService
  ) {}

  /** 🟢 Aprovar orçamento */
  aprovar() {
    if (!this.data?.idSolicitacao) return;
    this.loading = true;
    this.solicitacaoService.atualizarStatus(this.data.idSolicitacao, 4).subscribe({
      next: (updated) => {
        this.loading = false;
        this.dialogRef.close({
          action: 'APROVAR',
          newStatusName: 'APROVADA',
          newStatusId: 4,
          user: updated,
        });
      },
      error: (err) => {
        console.error('Erro ao aprovar:', err);
        this.loading = false;
        this.error = 'Falha ao aprovar a solicitação.';
      },
    });
  }

  /** 🔴 Rejeitar orçamento */
  rejeitar() {
    if (!this.data?.idSolicitacao) return;
    const motivo = prompt('Motivo da rejeição:');
    if (!motivo) return;

    this.loading = true;
    this.solicitacaoService.atualizarStatus(this.data.idSolicitacao, 3).subscribe({
      next: (updated) => {
        this.loading = false;
        this.dialogRef.close({
          action: 'REJEITAR',
          newStatusName: 'REJEITADA',
          newStatusId: 3,
          motivo,
          user: updated,
        });
      },
      error: (err) => {
        console.error('Erro ao rejeitar:', err);
        this.loading = false;
        this.error = 'Falha ao rejeitar a solicitação.';
      },
    });
  }

  /** 💰 Efetuar pagamento */
  pagar() {
    if (!this.data?.idSolicitacao) return;
    this.loading = true;
    this.solicitacaoService.atualizarStatus(this.data.idSolicitacao, 7).subscribe({
      next: (updated) => {
        this.loading = false;
        this.dialogRef.close({
          action: 'PAGAR',
          newStatusName: 'PAGA',
          newStatusId: 7,
          user: updated,
        });
      },
      error: (err) => {
        console.error('Erro ao pagar:', err);
        this.loading = false;
        this.error = 'Falha ao confirmar pagamento.';
      },
    });
  }

  /** ❌ Fecha o diálogo */
  close() {
    this.dialogRef.close();
  }

  /** 🕓 Tempo decorrido desde a abertura */
  calcularTempoDecorrido(dataCriacao: string): string {
    const inicio = new Date(dataCriacao).getTime();
    const agora = Date.now();
    const diff = agora - inicio;

    const dias = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (dias > 0) return `${dias} dia(s) atrás`;

    const horas = Math.floor(diff / (1000 * 60 * 60));
    if (horas > 0) return `${horas} hora(s) atrás`;

    const minutos = Math.floor(diff / (1000 * 60));
    return `${minutos} minuto(s) atrás`;
  }
}
