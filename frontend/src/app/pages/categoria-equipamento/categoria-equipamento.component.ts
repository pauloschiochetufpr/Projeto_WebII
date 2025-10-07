import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoriaEquipamentoService } from '../../services/categoria-equipamento';
import { CategoriaEquipamento } from '../../models/solicitacao.model';
import { RouterModule } from '@angular/router';
import { NgForm } from '@angular/forms';
import { CadastroCategoriaComponent } from './cadastro-categoria/cadastro-categoria.component'

@Component({
  selector: 'app-categoria-equipamento',
  imports: [CommonModule, RouterModule],
  templateUrl: './categoria-equipamento.component.html',
  styleUrl: './categoria-equipamento.component.css'
})
export class CategoriaEquipamentoComponent implements OnInit {
    listaCategorias : CategoriaEquipamento[] = [];
    
    constructor(private categoriaEquipamentoService : CategoriaEquipamentoService){}
    
    ngOnInit(): void {
      this.listaCategorias = this.listarTodos();
    }

    listarTodos(): CategoriaEquipamento[]{
      //return this.categoriaEquipamentoService.listarTodos();
      return[
        new CategoriaEquipamento(1, "Impressora", true),
        new CategoriaEquipamento(2, "Teee", true),
      ]
    }
}

