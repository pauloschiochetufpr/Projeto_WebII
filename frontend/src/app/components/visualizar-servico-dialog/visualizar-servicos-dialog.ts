import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

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
export class VisualizarServicoDialog {
  descricaoManutencao: string = '';
  orientacoesCliente: string = '';

 constructor(
  public dialogRef: MatDialogRef<VisualizarServicoDialog>,
  @Inject(MAT_DIALOG_DATA) public data: { user: Solicitation, currentDestination: string }
) {}

  // Efetuar Orçamento
  efetuarOrcamento() {
    const valor = prompt('Digite o valor do orçamento:');
    if (valor) {
      this.data.user.budget = parseFloat(valor);
      this.dialogRef.close({ action: 'ORÇAR', user: this.data.user, budget: this.data.user.budget });
    }
  }

  // Resgatar serviço rejeitado
  resgatar() {
    this.dialogRef.close({ action: 'RESGATAR', user: this.data.user });
  }

  // Efetuar Manutenção
  registrarManutencao() {
    this.dialogRef.close({
      action: 'ARRUMAR',
      user: this.data.user,
      descricao: this.descricaoManutencao,
      orientacoes: this.orientacoesCliente,
    });
  }

  // Redirecionar Manutenção
  redirecionar() {
    const destino = prompt('Digite o destino para redirecionamento:');
    this.dialogRef.close({ action: 'REDIRECIONAR', user: this.data.user, destino });
  }

  // Pagar Serviço
  pagar() {
    this.dialogRef.close({ action: 'PAGAR', user: this.data.user });
  }

  // Finalizar Solicitação
  finalizar() {
    this.dialogRef.close({ action: 'FINALIZAR', user: this.data.user });
  }

  close() {
    this.dialogRef.close();
  }
  // Redirecionar para si mesmo
redirecionarParaMim() {
  this.dialogRef.close({
    action: 'REDIRECIONAR',
    user: this.data.user,
    destino: this.data.currentDestination 
  });
}

}
