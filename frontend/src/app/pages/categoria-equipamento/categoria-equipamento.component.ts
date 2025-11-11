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

  ngOnInit(): void{
    this.categoriasEquipamento = this.listarTodos(); 
  }

  listarTodos(): CategoriaEquipamento[]{
    return this.categoriaEquipamentoService.listarTodos();
  }

    
  }


