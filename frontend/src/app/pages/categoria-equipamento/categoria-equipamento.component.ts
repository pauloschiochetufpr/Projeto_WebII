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
export class CategoriaEquipamentoComponent implements OnInit {
    listaCategorias : CategoriaEquipamento[] = [];

    categoriaSelecionada: CategoriaEquipamento = new CategoriaEquipamento(0, '', true);
    
    editando: boolean = false;


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

    abrirModalNova() {
    this.categoriaSelecionada = new CategoriaEquipamento(0, '', true);
    this.editando = false;
    (document.getElementById("categoriaModal") as any).style.display = "block";
  }

  abrirModalEditar(categoria: CategoriaEquipamento) {
    this.categoriaSelecionada = { ...categoria };
    this.editando = true;
    (document.getElementById("categoriaModal") as any).style.display = "block";
  }

  fecharModal() {
    (document.getElementById("categoriaModal") as any).style.display = "none";
  }

  salvarCategoria() {
    if (this.editando) {
      const index = this.listaCategorias.findIndex(c => c.id === this.categoriaSelecionada.id);
      if (index !== -1) {
        this.listaCategorias[index] = { ...this.categoriaSelecionada };
      }
    } else {
      const novoId = this.listaCategorias.length > 0 ? Math.max(...this.listaCategorias.map(c => c.id)) + 1 : 1;
      this.categoriaSelecionada.id = novoId;
      this.listaCategorias.push({ ...this.categoriaSelecionada });
    }
    this.fecharModal();
  }

  removerCategoria(categoria: CategoriaEquipamento) {
    this.listaCategorias = this.listaCategorias.filter(c => c.id !== categoria.id);
  }
    


  }


  //vffv


