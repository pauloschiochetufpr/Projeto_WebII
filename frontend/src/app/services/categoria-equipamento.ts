import { Injectable } from '@angular/core';
import { CategoriaEquipamento } from '../models/solicitacao.model'

const LS_CHAVE = "categoriaEquipamento";

@Injectable({
  providedIn: 'root'
})
export class CategoriaEquipamentoService {
  
  constructor(){ };

  listarTodos():CategoriaEquipamento[]{
    const categoriaEquipamento = localStorage[LS_CHAVE]
    return categoriaEquipamento ? JSON.parse(categoriaEquipamento) : []; 
  }

  inserir(categoriaEquipamento : CategoriaEquipamento) : void {
    const listaCategoriaEquipamento = this.listarTodos();
    categoriaEquipamento.id = new Date().getTime();
    listaCategoriaEquipamento.push(categoriaEquipamento);
    localStorage[LS_CHAVE] = JSON.stringify(categoriaEquipamento);
  }

  atualizar(categoriaEquipamento : CategoriaEquipamento): void {
    const listaCategoriaEquipamento = this.listarTodos();
    listaCategoriaEquipamento.forEach((obj, index, objs)=>{
      if (categoriaEquipamento.id === obj.id){
        objs[index] = categoriaEquipamento
      }
    });
    localStorage[LS_CHAVE] = JSON.stringify(categoriaEquipamento);
  }

  remover(id:number): void{
    let listaCategoriaEquipamento = this.listarTodos();
    listaCategoriaEquipamento = 
      listaCategoriaEquipamento.
        filter(CategoriaEquipamento => CategoriaEquipamento.id !== id);
    localStorage[LS_CHAVE] = JSON.stringify(listaCategoriaEquipamento);
  }


}
