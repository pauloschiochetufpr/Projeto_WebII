import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Funcionario } from '../../../models/usuario.model';
import { FuncionarioService } from '../../../services/funcionario';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalUsuarioComponent } from '../modal-usuario/modal-usuario';

@Component({
  selector: 'app-listar-usuario',
  imports: [CommonModule, RouterModule],
  templateUrl: './listar-usuario.html',
  styleUrl: './listar-usuario.css'
})
export class ListarUsuario implements OnInit {
  funcionarios: Funcionario[] = []; 

  constructor(private funcionarioService: FuncionarioService,
    private modalService : NgbModal
  ){}
  
  ngOnInit(): void {
    this.listarTodos();
  }

  listarTodos(): Funcionario[]{
    this.funcionarioService.listarTodos().subscribe({
      next: (data: Funcionario[]) => {
        if (data == null) {
          this.funcionarios = [];
        }
        else {
          this.funcionarios = data;
        }
      }
    });
    return this.funcionarios
  }

  remover($event: any, funcionario: Funcionario): void {
    $event.preventDefault();
    if (confirm(`Deseja realmente remover o usuário ${funcionario.nome}?`)){
      this.funcionarioService.remover(funcionario.id_funcionario!).subscribe({
        complete: () => { this.listarTodos(); }
      });
    }
  }

  abrirModal(funcionario: Funcionario){
    const modalRef = this.modalService.open(ModalUsuarioComponent);
    modalRef.componentInstance.funcionario = funcionario;
  }

}
