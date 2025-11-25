import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Funcionario } from '../../../models/usuario.model';
import { FuncionarioService } from '../../../services/funcionario';
import { ModalUsuarioComponent } from '../modal-usuario/modal-usuario';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-listar-usuario',
  standalone: true,
  imports: [CommonModule, RouterModule, MatDialogModule],
  templateUrl: './listar-usuario.html',
  styleUrls: ['./listar-usuario.css']
})
export class ListarUsuario implements OnInit {
  funcionarios: Funcionario[] = [];

  constructor(
    private funcionarioService: FuncionarioService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.listarTodos();
  }

  listarTodos(): void {
    this.funcionarioService.listarTodos().subscribe({
      next: (data: Funcionario[]) => {
        this.funcionarios = data.map(f => ({
          ...f,
          dataNasc: f.dataNasc ? this.formatarData(f.dataNasc) : ''
        }));
      },
      error: (err) => {
        console.error('Erro ao listar usuários', err);
        this.funcionarios = [];
      }
    });
  }

  formatarData(dataStr: string): string {
    const d = new Date(dataStr);
    return d.toLocaleDateString('pt-BR');
  }

  remover($event: any, funcionario: Funcionario): void {
    $event.preventDefault();
    if (confirm(`Deseja realmente remover o usuário ${funcionario.nome}?`)) {
      this.funcionarioService.remover(funcionario.id!).subscribe({
        complete: () => this.listarTodos()
      });
    }
  }

  abrirModal(funcionario: Funcionario) {
    this.dialog.open(ModalUsuarioComponent, {
      width: '450px',
      data: funcionario
    });
  }
}
