import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

// Interface do usuário / solicitação (ampliada)
export interface User {
  idSolicitacao?: number;
  id?: number | string;
  idCliente?: number;
  nome?: string;
  name?: string;
  descricao?: string;
  description?: string;
  dataHora?: string;
  createdAt?: string;
  date?: string;
  idStatus?: number;
  state?: string;
  valor?: number;
  redirectDestinationName?: string;
  // manter campos originais
  [key: string]: any;
}

// Interface de histórico (mock)
export interface HistSolicitacao {
  idHistorico?: number;
  idSolicitacao: number | string;
  dataHora: string; // ISO string no momento da alteração
  cliente: boolean; // true se alteração por cliente
  statusOld?: string | null;
  statusNew?: string | null;
  funcionarioOld?: number | null;
  funcionarioNew?: number | null;
  actor?: string; // 'CLIENTE' | 'FUNCIONARIO' | 'SYSTEM'
}

@Injectable({
  providedIn: 'root',
})
export class JsonTestService {
  private jsonUrl = 'assets/data.json';
  private storageKey = 'mock_solicitacoes_v1';
  private histStorageKey = 'mock_hist_solicitacoes_v1';

  // BehaviorSubject com o array atual de users/solicitacoes
  private users$$ = new BehaviorSubject<User[]>([]);
  public users$ = this.users$$.asObservable();

  // histórico em memória
  private hist$$ = new BehaviorSubject<HistSolicitacao[]>([]);
  public hist$ = this.hist$$.asObservable();

  // contadores para ids mock (quando criar histórico)
  private histCounter = 1;

  constructor(private http: HttpClient) {
    // inicializa: tenta carregar do localStorage, senão do assets
    this.loadInitialData();
  }

  // --- carregamento inicial ---
  private loadInitialData(): void {
    const saved = localStorage.getItem(this.storageKey);
    const savedHist = localStorage.getItem(this.histStorageKey);

    if (saved) {
      try {
        const arr = JSON.parse(saved) as User[];
        this.users$$.next(arr);
      } catch (e) {
        console.error(
          'Failed to parse saved solicitacoes from localStorage',
          e
        );
        this.fetchFromAssets();
      }
    } else {
      this.fetchFromAssets();
    }

    if (savedHist) {
      try {
        const h = JSON.parse(savedHist) as HistSolicitacao[];
        this.hist$$.next(h);
        this.histCounter =
          h.reduce((max, it) => Math.max(max, Number(it.idHistorico ?? 0)), 0) +
          1;
      } catch {
        this.hist$$.next([]);
      }
    } else {
      this.hist$$.next([]);
    }
  }

  private fetchFromAssets(): void {
    this.http
      .get<User[]>(this.jsonUrl)
      .pipe(
        catchError((err) => {
          console.error('Erro ao carregar assets data.json', err);
          return of([] as User[]);
        }),
        tap((data) => {
          // normalizar ids: garantir que cada item possua id (idSolicitacao ou id)
          const normalized = (data || []).map((d, idx) => {
            // forçar id se não existir
            if (!d.id && !d.idSolicitacao) {
              const syntheticId = Date.now() + idx;
              d.idSolicitacao = syntheticId;
              d.id = syntheticId;
            } else {
              if (!d.id && d.idSolicitacao) d.id = d.idSolicitacao;
              if (!d.idSolicitacao && d.id) d.idSolicitacao = Number(d.id);
            }
            return d;
          });
          this.users$$.next(normalized);
          // salva no localStorage (opcional)
          localStorage.setItem(this.storageKey, JSON.stringify(normalized));
        })
      )
      .subscribe();
  }

  // --- API pública tradicional (compatível com uso antigo) ---
  // Retorna um Observable do array atual (emitirá atualizações)
  getUsers(): Observable<User[]> {
    return this.users$;
  }

  // Retorna snapshot (sincrono)
  getUsersSnapshot(): User[] {
    return this.users$$.getValue();
  }

  // encontra um item por id (número ou string)
  findById(id: number | string): User | undefined {
    const arr = this.getUsersSnapshot();
    return arr.find((u) => String(u.id ?? u.idSolicitacao) === String(id));
  }

  // --- Histórico ---
  getHistoryForSolicitacao(id: number | string): HistSolicitacao[] {
    const arr = this.hist$$.getValue();
    return arr.filter((h) => String(h.idSolicitacao) === String(id));
  }

  // --- Update de status (mock) ---
  /**
   * Atualiza o status de uma solicitação em memória e grava histórico mock.
   * Retorna Observable<User> com o item atualizado (compatível com HTTP).
   *
   * @param id idSolicitacao ou id
   * @param newStatusId número representando status (opcional)
   * @param newStatusName nome do status (opcional)
   * @param actor 'CLIENTE' | 'FUNCIONARIO' | 'SYSTEM' (para histórico)
   */
  updateStatus(
    id: number | string,
    newStatusId?: number,
    newStatusName?: string,
    actor: 'CLIENTE' | 'FUNCIONARIO' | 'SYSTEM' = 'CLIENTE'
  ): Observable<User | null> {
    const arr = [...this.getUsersSnapshot()];
    const idx = arr.findIndex(
      (u) => String(u.id ?? u.idSolicitacao) === String(id)
    );
    if (idx === -1) {
      console.warn('Solicitação não encontrada para updateStatus:', id);
      return of(null);
    }

    const old = { ...arr[idx] };
    const prevStatusName =
      old.state ?? (old.idStatus != null ? String(old.idStatus) : null);

    // aplicar mudança
    if (newStatusId !== undefined) arr[idx].idStatus = newStatusId;
    if (newStatusName !== undefined) arr[idx].state = newStatusName;

    // atualiza BehaviorSubject + localStorage
    this.users$$.next(arr);
    localStorage.setItem(this.storageKey, JSON.stringify(arr));

    // gravar histórico mock
    const hist: HistSolicitacao = {
      idHistorico: this.histCounter++,
      idSolicitacao: arr[idx].id ?? arr[idx].idSolicitacao!,
      dataHora: new Date().toISOString(),
      cliente: actor === 'CLIENTE',
      statusOld: prevStatusName,
      statusNew:
        newStatusName ??
        (newStatusId !== undefined ? String(newStatusId) : null),
      funcionarioOld: null,
      funcionarioNew: null,
      actor,
    };

    const newHistArr = [...this.hist$$.getValue(), hist];
    this.hist$$.next(newHistArr);
    localStorage.setItem(this.histStorageKey, JSON.stringify(newHistArr));

    // log para debug
    console.log('updateStatus: ', { id, newStatusId, newStatusName, actor });
    console.log('hist created (mock):', hist);

    // retornar o item atualizado como Observable (imitando uma resposta HTTP)
    return of(arr[idx]);
  }

  // utilitário para criar uma nova solicitação (mock)
  createSolicitacao(payload: Partial<User>): Observable<User> {
    const arr = [...this.getUsersSnapshot()];
    const newId = Number(Date.now());
    const item: User = {
      ...payload,
      idSolicitacao: newId,
      id: newId,
      dataHora: payload.dataHora ?? new Date().toISOString(),
    } as User;
    arr.push(item);
    this.users$$.next(arr);
    localStorage.setItem(this.storageKey, JSON.stringify(arr));

    // opcional: criar histórico de criação
    const hist: HistSolicitacao = {
      idHistorico: this.histCounter++,
      idSolicitacao: newId,
      dataHora: new Date().toISOString(),
      cliente: false,
      statusOld: null,
      statusNew:
        payload.state ??
        (payload.idStatus ? String(payload.idStatus) : 'CRIAÇÃO'),
      funcionarioOld: null,
      funcionarioNew: null,
      actor: 'SYSTEM',
    };
    const newHistArr = [...this.hist$$.getValue(), hist];
    this.hist$$.next(newHistArr);
    localStorage.setItem(this.histStorageKey, JSON.stringify(newHistArr));

    return of(item);
  }

  // utilitário para salvar todo o array (substituir mock completo)
  replaceAll(users: User[]) {
    this.users$$.next(users);
    localStorage.setItem(this.storageKey, JSON.stringify(users));
  }

  // resetar mock (apagar localStorage e recarregar do assets)
  resetMockFromAssets() {
    localStorage.removeItem(this.storageKey);
    localStorage.removeItem(this.histStorageKey);
    this.fetchFromAssets();
    this.hist$$.next([]);
    this.histCounter = 1;
  }
}
