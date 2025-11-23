import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

interface Funcionario {
  id: number;
  nome: string;
}

@Injectable({ providedIn: 'root' })
export class FuncionarioService {
  private baseUrl = `${environment.apiUrl}/funcionarios`;

  constructor(private http: HttpClient) {}

  listarTodos(): Observable<Funcionario[]> {
    return this.http.get<Funcionario[]>(`${this.baseUrl}`).pipe(
      catchError((err) => {
        console.error('Erro ao listar funcionários', err);
        return throwError(() => new Error('Falha ao listar funcionários'));
      })
    );
  }
}
