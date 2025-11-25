import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Funcionario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})


export class FuncionarioService {
  BASE_URL = "https://localhost:8443/api/funcionarios";

  
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private httpClient: HttpClient) {}

  listarTodos(): Observable<Funcionario[]> {
    return this.httpClient.get<Funcionario[]>(this.BASE_URL, this.httpOptions);
  }

  buscarPorId(id: number): Observable<Funcionario> {
    return this.httpClient.get<Funcionario>(`${this.BASE_URL}/${id}`, this.httpOptions);
  }

  inserir(funcionario: Funcionario): Observable<Funcionario> {
    return this.httpClient.post<Funcionario>(this.BASE_URL, funcionario, this.httpOptions);
  }

  alterar(funcionario: Funcionario): Observable<Funcionario> {
    const payload = {
      nome: funcionario.nome,
      dataNasc: funcionario.dataNasc,
      telefone: funcionario.telefone,
      ativo: funcionario.ativo
    };
    return this.httpClient.put<Funcionario>(`${this.BASE_URL}/${funcionario.id}`, payload, this.httpOptions);
  }

  remover(id: number, currentUserId: number = 1): Observable<void> {
    return this.httpClient.delete<void>(`${this.BASE_URL}/${id}`, {
      headers: new HttpHeaders({ "X-USER-ID": currentUserId.toString() })
    });
  }
}
