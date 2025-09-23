import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { SolicitacaoCreateDto, CategoriaEquipamento } from './solicitacao.model';

@Injectable({
  providedIn: 'root'
})
export class SolicitacaoService {

  private categoriasMock: CategoriaEquipamento[] = [
    { id: 1, nome: 'Notebook', ativo: true },
    { id: 2, nome: 'Desktop', ativo: true },
    { id: 3, nome: 'Impressora', ativo: true },
    { id: 4, nome: 'Mouse', ativo: true },
    { id: 5, nome: 'Teclado', ativo: true }
  ];

  constructor() { }

  getCategorias(): Observable<CategoriaEquipamento[]> {
    return of(this.categoriasMock.filter(cat => cat.ativo)).pipe(delay(300));
  }

  criarSolicitacao(data: SolicitacaoCreateDto): Observable<any> {
    const simulateError = Math.random() < 0.1;

    if (simulateError) {
      return throwError(() => new Error('Erro ao enviar solicitação')).pipe(delay(1000));
    }

    const novaSolicitacao = {
      id: Math.floor(Math.random() * 1000) + 1,
      ...data,
      dataHora: new Date().toISOString(),
      idStatus: 1, // ABERTA
      state: 'ABERTA',
      idCliente: 1
    };

    console.log('Solicitação criada (mock):', novaSolicitacao);
    
    return of({ success: true, data: novaSolicitacao }).pipe(delay(1500));
  }
}