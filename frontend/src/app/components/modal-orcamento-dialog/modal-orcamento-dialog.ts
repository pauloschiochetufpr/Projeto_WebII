import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-modal-orcamento-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-6 w-full max-w-md font-sansation">
      <h2 class="text-xl font-semibold text-azul-main mb-4">
        Inserir Orçamento
      </h2>

      <label class="block text-slate-700 mb-3">
        Valor do Orçamento (R$):
        <input
          type="number"
          min="0"
          [(ngModel)]="valor"
          class="w-full p-2 border border-azul-main rounded-md mt-1
                 focus:ring-2 focus:ring-verde-sec"
        />
      </label>

      <div class="flex justify-end gap-3 mt-6">
        <button
          (click)="cancel()"
          class="px-4 py-2 rounded-md bg-gray-200 text-gray-800 font-semibold"
        >
          Cancelar
        </button>

        <button
          (click)="confirm()"
          class="px-4 py-2 rounded-md bg-verde-sec bg-opacity-80
                 hover:bg-opacity-100 text-azul-main font-semibold transition"
        >
          Confirmar
        </button>
      </div>
    </div>
  `,
})
export class ModalOrcamentoDialog {
  valor: number = 0;

  constructor(
    private dialogRef: MatDialogRef<ModalOrcamentoDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  cancel() {
    this.dialogRef.close(null);
  }

  confirm() {
    this.dialogRef.close(this.valor);
  }
}
