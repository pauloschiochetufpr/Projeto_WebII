import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoriaEquipamentoService } from '../../services/categoria-equipamento';
import { CategoriaEquipamento } from '../../models/solicitacao.model';
import { RouterModule } from '@angular/router';
import { NgForm } from '@angular/forms';
import { NgModel } from '@angular/forms';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-categoria-equipamento',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './categoria-equipamento.component.html',
  styleUrl: './categoria-equipamento.component.css'
})
export class CategoriaEquipamentoComponent {
  categoriasEquipamento : CategoriaEquipamento[] = [] 

  constructor(private categoriaEquipamentoService: CategoriaEquipamentoService){}

  listarTodos(): CategoriaEquipamento[]{
    return this.categoriaEquipamentoService.listarTodos();
  }

    ngOnInit(): void{
    this.categoriasEquipamento = this.listarTodos(); 
    console.log('Tipo:', typeof this.categoriasEquipamento);
    console.log('É array?', Array.isArray(this.categoriasEquipamento));
    console.log('Conteúdo:', this.categoriasEquipamento);
  }

  remover($event: any, categoria: CategoriaEquipamento): void {
    $event.preventDefault();
    if(confirm(`Deseja realmente remover a categoria ${categoria.nome}?`)){
      this.categoriaEquipamentoService.remover(categoria.id)
      this.categoriasEquipamento = this.listarTodos()
    }

  }




    
  }


