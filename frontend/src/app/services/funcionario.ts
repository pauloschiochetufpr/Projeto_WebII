import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Funcionario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class FuncionarioService {
  BASE_URL = "http://localhost:3000/funcionarios";

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  constructor(private httpClient: HttpClient) {}

  listarTodos(): Observable<Funcionario[]>{
    return this.httpClient.get<Funcionario[]>(
      this.BASE_URL, this.httpOptions
    );
  }

  buscarPorId(id: number): Observable<Funcionario>{
    return this.httpClient.get<Funcionario>(
      this.BASE_URL + "/" + id,
      this.httpOptions
    );
  }

  inserir(funcionario: Funcionario): Observable<Funcionario> {
    return this.httpClient.post<Funcionario>(
      this.BASE_URL,
      JSON.stringify(funcionario),
      this.httpOptions
    );
  }

  remover(id: number): Observable<Funcionario>{
    return this.httpClient.delete<Funcionario>(
      this.BASE_URL + "/" +id,
      this.httpOptions
    )
  }

  alterar(funcionario: Funcionario): Observable<Funcionario>{
    return this.httpClient.put<Funcionario>(
      this.BASE_URL + "/" + funcionario.id_funcionario,
      JSON.stringify(funcionario),
      this.httpOptions
    )
  }
  
}
