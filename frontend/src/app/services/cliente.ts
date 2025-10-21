import { Injectable } from '@angular/core';
import { Cliente as ClienteClass } from '../models/solicitacao.model';

const LS_CHAVE = "cliente";

@Injectable({
  providedIn: 'root'
})
export class Cliente {

  listarTodos() : ClienteClass[] {
    const clientes = localStorage[LS_CHAVE];
    return clientes ? JSON.parse(clientes) : [];
  }

  inserir(cliente : ClienteClass) : void {
    const clientes = this.listarTodos();
    cliente.idCliente = new Date().getTime();
    clientes.push(cliente);
    localStorage[LS_CHAVE] = JSON.stringify(clientes)
  }

  atualizar(cliente: ClienteClass): void {
    const clientes = this.listarTodos();
    clientes.forEach(
      (obj, index, objs) => {
        if ( cliente.idCliente === obj.idCliente ) {
          objs[index] = cliente 
        }
      }
    )
    localStorage[LS_CHAVE] = JSON.stringify(clientes)
  }

  remover(id : number) : void {
    let clientes = this.listarTodos();
    clientes = clientes.filter(cliente => cliente.idCliente !== id)
    localStorage[LS_CHAVE] = JSON.stringify(clientes);
  }

  
}
