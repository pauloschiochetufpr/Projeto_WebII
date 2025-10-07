import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Solicitation } from '../../pages/home-cliente/home-cliente';

@Component({
  selector: 'app-visualizar-servico-cliente-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './visualizar-servico-cliente.html',
})
export class VisualizarServicoClienteDialog {
  constructor(
    public dialogRef: MatDialogRef<VisualizarServicoClienteDialog>,
    @Inject(MAT_DIALOG_DATA) public data: Solicitation
  ) {}

  aprovar() {
    this.dialogRef.close({ action: 'APROVAR', newStatusName: 'APROVADA', newStatusId: 4 });
  }

  rejeitar() {
    const motivo = prompt('Motivo da rejeição:');
    if (motivo) {
      this.dialogRef.close({ action: 'REJEITAR', newStatusName: 'REJEITADA', newStatusId: 3, motivo });
    }
  }

  pagar() {
    this.dialogRef.close({ action: 'PAGAR', newStatusName: 'PAGA', newStatusId: 7 });
  }

  close() {
    this.dialogRef.close();
  }
  // Calcula quanto tempo se passou desde a criação da solicitação
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
