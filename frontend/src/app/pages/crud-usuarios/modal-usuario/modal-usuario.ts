import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Funcionario } from '../../../models/usuario.model';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-modal-usuario',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './modal-usuario.html',
  styleUrls: ['./modal-usuario.css']
})
export class ModalUsuarioComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public funcionario: Funcionario,
    public dialog: MatDialogRef<ModalUsuarioComponent>
  ) {}
}
