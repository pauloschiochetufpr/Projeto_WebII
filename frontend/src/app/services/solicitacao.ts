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

  // cliente cria solicitação (mexer só no id pra ser o de quem esta criando)
  criarSolicitacao(data: SolicitacaoCreateDto): Observable<SolicitacaoDto> {
    const dto = {
      nome: data.descricaoEquipamento,
      descricao: data.descricaoDefeito,
      idCliente: 1,
      idCategoria: this.mapCategoria(data.categoriaEquipamento),
      valor: 0,
      idStatus: 1,
      ativo: true,
    };

    return this.http.post<SolicitacaoDto>(this.baseUrl, dto);
  }

  atualizarSolicitacao(
    id: number,
    dto: Partial<SolicitacaoDto>
  ): Observable<SolicitacaoDto> {
    return this.http.put<SolicitacaoDto>(`${this.baseUrl}/${id}`, dto);
  }

  atualizarStatus(id: number, novoStatus: number): Observable<SolicitacaoDto> {
    return this.http.patch<SolicitacaoDto>(
      `${this.baseUrl}/${id}/status?novoStatus=${novoStatus}`,
      {}
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
    return of([
      { id: 1, nome: 'Notebook', ativo: true },
      { id: 2, nome: 'Desktop', ativo: true },
      { id: 3, nome: 'Impressora', ativo: true },
      { id: 4, nome: 'Mouse', ativo: true },
      { id: 5, nome: 'Teclado', ativo: true },
    ]).pipe(delay(300));
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
