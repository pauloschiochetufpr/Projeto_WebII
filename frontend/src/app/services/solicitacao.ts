import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, delay, catchError } from 'rxjs/operators';
import {
  SolicitacaoCreateDto,
  CategoriaEquipamento,
} from '../models/solicitacao.model';
import { environment } from '../../environments/environment';

export interface SolicitacaoDto {
  idSolicitacao: number;
  nome: string;
  descricao: string;
  idCliente: number;
  valor: number;
  idStatus: number;
  idCategoria: number;
  ativo: boolean;
  createdAt?: string;
  dataHora?: string;
  cliente?: { nome?: string };
}

export interface HistSolicitacao {
  id: number;
  solicitacaoId: number | null;
  cliente: boolean | null;
  statusOld: string | null;
  statusNew: string | null;
  funcionarioOld: number | null;
  funcionarioNew: number | null;
  dataHora: string;
}

@Injectable({
  providedIn: 'root',
})
export class SolicitacaoService {
  private baseUrl = `${environment.apiUrl}/solicitacoes`;

  constructor(private http: HttpClient) {}

  private mapCategoria(nomeCategoria: string): number {
    switch (nomeCategoria?.toLowerCase()) {
      case 'notebook':
        return 1;
      case 'desktop':
        return 2;
      case 'impressora':
        return 3;
      case 'mouse':
        return 4;
      case 'teclado':
        return 5;
      default:
        return 0;
    }
  }

  listarTodas(): Observable<SolicitacaoDto[]> {
    return this.http.get<SolicitacaoDto[]>(this.baseUrl).pipe(
      catchError((err) => {
        console.error('Erro ao buscar solicitações', err);
        return throwError(() => new Error('Falha ao buscar solicitações'));
      })
    );
  }

  // busca solicitações de um cliente com última atualização
  listarPorClienteComLastUpdate(clienteId: number): Observable<any[]> {
    return this.http
      .get<any[]>(`${this.baseUrl}/cliente/${clienteId}/with-last-update`)
      .pipe(
        catchError((err) => {
          console.error(
            `Erro ao buscar solicitações do cliente ${clienteId} com lastUpdate`,
            err
          );
          return throwError(
            () =>
              new Error(
                'Falha ao buscar solicitações do cliente com lastUpdate'
              )
          );
        })
      );
  }

  // busca solicitações de um funcionário com última atualização
  listarPorFuncionarioComLastUpdate(funcionarioId: number): Observable<any[]> {
    return this.http
      .get<any[]>(
        `${this.baseUrl}/funcionario/${funcionarioId}/with-last-update`
      )
      .pipe(
        // Em caso de 204 sem body o HttpClient pode retornar null, normalizamos pra []
        map((res) => res ?? []),
        catchError((err) => {
          console.error(
            `Erro ao buscar solicitações do funcionário ${funcionarioId} com lastUpdate`,
            err
          );
          return throwError(
            () =>
              new Error(
                'Falha ao buscar solicitações do funcionário com lastUpdate'
              )
          );
        })
      );
  }

  // busca com última atualização
  listarTodasComLastUpdate(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/with-last-update`).pipe(
      catchError((err) => {
        console.error('Erro ao buscar solicitacoes com lastUpdate', err);
        return throwError(
          () => new Error('Falha ao buscar solicitacoes com lastUpdate')
        );
      })
    );
  }

  // buscar solicitações por idStatus (ex: 1 = ABERTA)
  buscarPorStatus(idStatus: number): Observable<SolicitacaoDto[]> {
    return this.http
      .get<SolicitacaoDto[]>(`${this.baseUrl}/status/${idStatus}`)
      .pipe(
        catchError((err) => {
          console.error('Erro ao buscar solicitações por status', err);
          return throwError(
            () => new Error('Falha ao buscar solicitações por status')
          );
        })
      );
  }

  // cliente cria solicitação (mexer só no id pra ser o de quem esta criando)
  criarSolicitacao(data: SolicitacaoCreateDto): Observable<SolicitacaoDto> {
    const dto = {
      nome: data.descricaoEquipamento,
      descricao: data.descricaoDefeito,
      idCliente: 1, // TODO: pegar do usuário autenticado
      idCategoria: this.mapCategoria(data.categoriaEquipamento),
      valor: 0,
      idStatus: 1,
      ativo: true,
    };

    console.log('Enviando solicitação:', dto); // Para debug

    return this.http.post<SolicitacaoDto>(this.baseUrl, dto).pipe(
      catchError((err) => {
        console.error('Erro detalhado:', err);
        return throwError(() => err);
      })
    );
  }

  atualizarSolicitacao(
    id: number,
    dto: Partial<SolicitacaoDto>
  ): Observable<SolicitacaoDto> {
    return this.http.put<SolicitacaoDto>(`${this.baseUrl}/${id}`, dto);
  }

  atualizarStatus(
    id: number,
    novoStatus: number,
    cliente: boolean = false,
    funcionarioId?: number
  ): Observable<any> {
    const body: any = { novoStatus, cliente };
    if (funcionarioId !== undefined && funcionarioId !== null) {
      body.funcionarioId = funcionarioId;
    }
    return this.http.patch<any>(`${this.baseUrl}/${id}/status`, body).pipe(
      catchError((err) => {
        console.error(`Erro ao atualizar status da solicitação ${id}`, err);
        return throwError(() => new Error('Falha ao atualizar status'));
      })
    );
  }

  // Buscar por ID
  buscarPorId(id: number): Observable<SolicitacaoDto> {
    return this.http.get<SolicitacaoDto>(`${this.baseUrl}/${id}`);
  }

  // Buscar histórico de uma solicitação
  getHistorico(idSolicitacao: number): Observable<HistSolicitacao[]> {
    return this.http
      .get<HistSolicitacao[]>(`${this.baseUrl}/${idSolicitacao}/historico`)
      .pipe(
        catchError((err) => {
          console.error('Erro ao buscar histórico', err);
          return throwError(() => new Error('Falha ao buscar histórico'));
        })
      );
  }

  // Listar categorias (com mock) fazer a integração
  getCategorias(): Observable<CategoriaEquipamento[]> {
    return this.http
      .get<CategoriaEquipamento[]>(`${environment.apiUrl}/categorias`)
      .pipe(
        catchError((err) => {
          console.error('Erro ao carregar categorias do backend', err);
          // Fallback em caso de erro
          return of([
            { id: 1, nome: 'Notebook', ativo: true },
            { id: 2, nome: 'Desktop', ativo: true },
            { id: 3, nome: 'Impressora', ativo: true },
            { id: 4, nome: 'Mouse', ativo: true },
            { id: 5, nome: 'Teclado', ativo: true },
          ]);
        })
      );
  }

  mapStatus(idStatus?: number): string {
    switch (idStatus) {
      case 1:
        return 'ABERTA';
      case 2:
        return 'ORÇADA';
      case 3:
        return 'APROVADA';
      case 4:
        return 'REJEITADA';
      case 5:
        return 'ARRUMADA';
      case 6:
        return 'PAGA';
      case 7:
        return 'FINALIZADA';
      case 8:
        return 'REDIRECIONADA';
      default:
        return 'DESCONHECIDO';
    }
  }
}
