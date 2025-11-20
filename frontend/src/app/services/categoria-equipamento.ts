import { Injectable } from '@angular/core';
import { CategoriaEquipamento } from '../models/solicitacao.model'

const LS_CHAVE = "categoriaEquipamento";

@Injectable({
  providedIn: 'root'
})
export class CategoriaEquipamentoService {
  
  constructor(){ };

  listarTodos():CategoriaEquipamento[] {
    const categoriaEquipamento = localStorage[LS_CHAVE]
    return categoriaEquipamento ? JSON.parse(categoriaEquipamento) : [];
  }

  inserir(categoriaEquipamento : CategoriaEquipamento) : void {
    const listaCategoriaEquipamento = this.listarTodos(); 
    console.log("Tipo: ", typeof listaCategoriaEquipamento)
    console.log("Dado: ", listaCategoriaEquipamento)
    categoriaEquipamento.id = new Date().getTime();  
    listaCategoriaEquipamento.push(categoriaEquipamento);
    localStorage[LS_CHAVE] = JSON.stringify(listaCategoriaEquipamento);
  }

  atualizar(categoriaEquipamento : CategoriaEquipamento): void {
    const listaCategoriaEquipamento = this.listarTodos();
    listaCategoriaEquipamento.forEach((obj, index, objs)=>{
      if (categoriaEquipamento.id === obj.id){   //ttttttttttttt
        objs[index] = categoriaEquipamento
      }
    });
    localStorage[LS_CHAVE] = JSON.stringify(listaCategoriaEquipamento);
  }

  remover(id:number): void{
    let listaCategoriaEquipamento = this.listarTodos();
    listaCategoriaEquipamento = 
      listaCategoriaEquipamento.
        filter(CategoriaEquipamento => CategoriaEquipamento.id !== id); // tttttttt
    localStorage[LS_CHAVE] = JSON.stringify(listaCategoriaEquipamento);
  }

  buscarPorId(id: number): CategoriaEquipamento | undefined{
    const listaCategoriaEquipamento = this.listarTodos();
    return listaCategoriaEquipamento.find(categoria => categoria.id === id);
  }


}
