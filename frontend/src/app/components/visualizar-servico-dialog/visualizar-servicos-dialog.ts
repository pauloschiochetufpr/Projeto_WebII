import { Component, Inject } from '@angular/core';
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
}

@Component({
  selector: 'app-visualizar-servico-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './visualizar-servicos-dialog.html',
  styleUrls: ['./visualizar-servicos-dialog.css'],
})
export class VisualizarServicosDialog {
  descricaoManutencao: string = '';
  orientacoesCliente: string = '';

 constructor(
  public dialogRef: MatDialogRef<VisualizarServicosDialog>,
  @Inject(MAT_DIALOG_DATA) public data: { user: Solicitation; currentDestination: string },
  private solicitacaoService: SolicitacaoService // 👈 injeta aqui
) {}


  // Efetuar Orçamento
efetuarOrcamento() {
  const valor = prompt('Digite o valor do orçamento:');
  if (!valor) return;

  const novoValor = parseFloat(valor);
  this.solicitacaoService.atualizarSolicitacao(Number(this.data.user.id), {
    valor: novoValor,
    idStatus: 2, // ORÇADA
  }).subscribe({
    next: (res) => {
      this.data.user.budget = res.valor;
      this.data.user.state = 'ORÇADA';
      this.dialogRef.close({ action: 'ORÇAR', user: this.data.user });
    },
    error: (err) => alert('Erro ao orçar: ' + err.message),
  });
}


  // Resgatar serviço rejeitado
resgatar() {
  this.solicitacaoService.atualizarStatus(Number(this.data.user.id), 3).subscribe({
    next: () => {
      this.data.user.state = 'APROVADA';
      this.dialogRef.close({ action: 'RESGATAR', user: this.data.user });
    },
    error: (err) => alert('Erro ao resgatar: ' + err.message),
  });
}


  // Efetuar Manutenção
registrarManutencao() {
  this.solicitacaoService.atualizarStatus(Number(this.data.user.id), 5).subscribe({
    next: () => {
      this.data.user.state = 'ARRUMADA';
      this.dialogRef.close({
        action: 'ARRUMAR',
        user: this.data.user,
        descricao: this.descricaoManutencao,
        orientacoes: this.orientacoesCliente,
      });
    },
    error: (err) => alert('Erro ao registrar manutenção: ' + err.message),
  });
}


  // Redirecionar Manutenção
redirecionar() {
  const destino = prompt('Digite o destino para redirecionamento:');
  if (!destino) return;

  this.solicitacaoService.atualizarStatus(Number(this.data.user.id), 8).subscribe({
    next: () => {
      this.data.user.state = 'REDIRECIONADA';
      this.data.user.redirectDestinationName = destino;
      this.dialogRef.close({ action: 'REDIRECIONAR', user: this.data.user, destino });
    },
    error: (err) => alert('Erro ao redirecionar: ' + err.message),
  });
}


// Pagar Serviço
pagar() {
  this.solicitacaoService.atualizarStatus(Number(this.data.user.id), 6).subscribe({
    next: () => {
      this.data.user.state = 'PAGA';
      this.dialogRef.close({ action: 'PAGAR', user: this.data.user });
    },
    error: (err) => alert('Erro ao pagar: ' + err.message),
  });
}


  // Finalizar Solicitação
finalizar() {
  this.solicitacaoService.atualizarStatus(Number(this.data.user.id), 7).subscribe({
    next: () => {
      this.data.user.state = 'FINALIZADA';
      this.dialogRef.close({ action: 'FINALIZAR', user: this.data.user });
    },
    error: (err) => alert('Erro ao finalizar: ' + err.message),
  });
}


  close() {
    this.dialogRef.close();
  }
// Redirecionar para si mesmo
redirecionarParaMim() {
  const destino = this.data.currentDestination;
  this.solicitacaoService.atualizarStatus(Number(this.data.user.id), 8).subscribe({
    next: () => {
      this.data.user.state = 'REDIRECIONADA';
      this.data.user.redirectDestinationName = destino;
      this.dialogRef.close({ action: 'REDIRECIONAR', user: this.data.user, destino });
    },
    error: (err) => alert('Erro ao redirecionar para si mesmo: ' + err.message),
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

}
