import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, delay, catchError } from 'rxjs/operators';
import {
  SolicitacaoCreateDto,
  CategoriaEquipamento,
} from '../models/solicitacao.model';
import { environment } from '../../environments/environment';
import { jwtDecode } from 'jwt-decode';
import { tap } from 'rxjs/operators';

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
  private usuarioId: number | null = null;

  constructor(private http: HttpClient) {
    this.extrairToken();
  }

  extrairToken() {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    try {
      const payload: any = jwtDecode(token);
      this.usuarioId = payload.id || null; //
    } catch (e) {
      console.error('Erro ao decodificar token:', e);
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

  criarSolicitacao(data: any): Observable<any> {
    console.log('[Service] criarSolicitacao chamado com data:', data);

    const idCategoria = Number(data.categoriaEquipamento);
    console.log('[Service] idCategoria convertido:', idCategoria);

    if (isNaN(idCategoria)) {
      console.error('[Service] Categoria inválida');
      return throwError(() => new Error('Categoria inválida.'));
    }

    const dto = {
      nome: data.descricaoEquipamento,
      descricao: data.descricaoDefeito,
      idCliente: this.usuarioId,
      valor: 0,
      idStatus: 1,
      idCategoria: idCategoria,
      ativo: true,
    };

    console.log('[Service] DTO criado:', dto);

    return this.http.post<any>(this.baseUrl, dto).pipe(
      tap({
        next: (res) =>
          console.log('[Service] Requisição HTTP bem-sucedida:', res),
        error: (err) =>
          console.error('[Service] Erro na requisição HTTP:', err),
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
          return of([{ id: 0, nome: 'erro', ativo: true }]);
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
