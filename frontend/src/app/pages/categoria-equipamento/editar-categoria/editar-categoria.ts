import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { CategoriaEquipamento } from '../../../models/solicitacao.model';
import { CategoriaEquipamentoService } from '../../../services/categoria-equipamento';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-editar-categoria',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './editar-categoria.html',
  styleUrl: './editar-categoria.css'
})
export class EditarCategoria implements OnInit {
  @ViewChild('formInserirCategoria') formInserirCategoria!: NgForm; 
  categoria : CategoriaEquipamento = new CategoriaEquipamento();

  constructor(
    private categoriaEquipamentoService : CategoriaEquipamentoService,
    private route : ActivatedRoute,
    private router : Router
  ){}

  ngOnInit(): void {
    let id = +this.route.snapshot.params['id'];
    const dado = this.categoriaEquipamentoService.buscarPorId(id);
    if (dado !== undefined){
      this.categoria = dado
    }else{
      throw new Error ("Categoria não encontrada: id = " + id);
    }
  }

  atualizar(): void{
    if(this.formInserirCategoria.form.valid){
      this.categoriaEquipamentoService.atualizar(this.categoria);
      this.router.navigate(['/categoriaEquipamento'])
    }
  }



}
