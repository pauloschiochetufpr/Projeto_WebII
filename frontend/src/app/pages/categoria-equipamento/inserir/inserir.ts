import { Component, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CategoriaEquipamento } from '../../../models/solicitacao.model';
import { CategoriaEquipamentoService } from '../../../services/categoria-equipamento';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-inserir',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './inserir.html',
  styleUrl: './inserir.css'
})


export class Inserir {
  @ViewChild('formInserirCategoria') formInserirCategoria! : NgForm;
  categoria : CategoriaEquipamento = new CategoriaEquipamento()
  

  constructor(
    private categoriaEquipamentoService : CategoriaEquipamentoService,
    private router: Router
  ){}

  inserir():void{
    console.log("Método Inserir() chamado!")
    if(this.formInserirCategoria.form.valid){
      console.log("Formulário Válido!")
      this.categoriaEquipamentoService.inserir(this.categoria)
      console.log("o inserir() do service foi chamado") 
      this.router.navigate(["/categoriaEquipamento"])
    }
  }
}
