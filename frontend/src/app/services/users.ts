import { Injectable } from '@angular/core';
import { UsersCrud as ModelUsers } from '../models/users-crud.model';

const LS_CHAVE="users";


@Injectable({
  providedIn: 'root'
})
export class Users {

  listarTodos(): ModelUsers[] {
    const lista = localStorage[LS_CHAVE];
    return lista ? JSON.parse(lista) : [];
  }

  inserir(user : ModelUsers): void {
    const listaUsers = this.listarTodos();
    listaUsers.push(user)
    localStorage[LS_CHAVE] = JSON.stringify(listaUsers);
  }

  atualizar(user: ModelUsers): void {
    const listaUsers = this.listarTodos();
    // Varre a lista de usuários
    // Quando encontra usuário com mesmo email, altera a lista
    // obj é o objeto do vetor. Index é o índice do vetor e objs é o vetor
    listaUsers.forEach( (obj, index, objs) => {
      if (user.email === obj.email) {
        objs[index] = user;
      }
    });
  }

  remover(user: ModelUsers): void {
    let listaUsers = this.listarTodos();
    listaUsers = listaUsers.filter(listaUsers => listaUsers.email !== user.email); 
    localStorage[LS_CHAVE] = JSON.stringify(listaUsers);

  }


  
}
