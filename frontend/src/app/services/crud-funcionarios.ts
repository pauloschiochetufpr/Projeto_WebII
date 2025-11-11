import { Injectable } from '@angular/core';
import { Funcionario } from '../models/solicitacao.model';

const LS_CHAVE = "funcionarios";

@Injectable({
  providedIn: 'root'
})
export class FuncionarioService {

  constructor() { }

  listarTodos(): Funcionario[] {
    const funcionarios = localStorage[LS_CHAVE];
    return funcionarios ? JSON.parse(funcionarios) : [];
  }

  buscarPorId(idFuncionario: number): Funcionario | undefined {
    const funcionarios = this.listarTodos();
    return funcionarios.find(f => f.idFuncionario === idFuncionario);
  }

  inserir(funcionario: Funcionario): void {
    const listaFuncionarios = this.listarTodos();
    funcionario.idFuncionario = new Date().getTime();
    listaFuncionarios.push(funcionario);
    localStorage[LS_CHAVE] = JSON.stringify(listaFuncionarios);
  }

  atualizar(funcionario: Funcionario): void {
    const listaFuncionarios = this.listarTodos();
    listaFuncionarios.forEach((obj, index, objs) => {
      if (funcionario.idFuncionario === obj.idFuncionario) {
        objs[index] = funcionario;
      }
    });
    localStorage[LS_CHAVE] = JSON.stringify(listaFuncionarios);
  }

  remover(idFuncionario: number): void {
    let listaFuncionarios = this.listarTodos();
    listaFuncionarios = listaFuncionarios.filter(
      f => f.idFuncionario !== idFuncionario
    );
    localStorage[LS_CHAVE] = JSON.stringify(listaFuncionarios);
  }

  ativarOuDesativar(idFuncionario: number): void {
    const listaFuncionarios = this.listarTodos();
    listaFuncionarios.forEach((funcionario) => {
      if (funcionario.idFuncionario === idFuncionario) {
        funcionario.ativo = !funcionario.ativo;
      }
    });
    localStorage[LS_CHAVE] = JSON.stringify(listaFuncionarios);
  }

}
