import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CategoriaEquipamento } from '../../../models/solicitacao.model';

@Component({
  selector: 'app-cadastro-categoria',
  templateUrl: './cadastro-categoria.component.html',
  styleUrls: ['./cadastro-categoria.component.css']
})
export class CadastroCategoriaComponent {
  @ViewChild('formCategoria') formCategoria!: NgForm;
}
