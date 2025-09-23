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
  createdAt?: string | number | null;
  date?: string | number | null;
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

          // aplicar normalização mais completa (datas/estado) antes de emitir
          const fullyNormalized = this.normalizeUsers(normalized);

          this.users$$.next(fullyNormalized);
          // salva no localStorage (opcional)
          localStorage.setItem(
            this.storageKey,
            JSON.stringify(fullyNormalized)
          );
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

    // retornamos o item atualizado
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

  // ------------------ NOVOS UTILITÁRIOS (NORMALIZAÇÃO / DATA) ------------------

  /**
   * Normaliza um array cru vindo do JSON para um formato consistente:
   * - infere campo de data (createdAt)
   * - tenta inferir state (state/status/statusName ou idStatus)
   * - normaliza state (sem acento/UPPERCASE)
   *
   * Retorna um array pronto para ser consumido por componentes.
   */
  normalizeUsers(data: any[]): any[] {
    // mapa default de idStatus -> nome (ajuste se seu backend tiver ids diferentes)
    const statusMapById: Record<number, string> = {
      1: 'ABERTA',
      2: 'ORCADA',
      3: 'REJEITADA',
      4: 'APROVADA',
      5: 'REDIRECIONADA',
      6: 'ARRUMADA',
      7: 'PAGA',
      8: 'FINALIZADA',
      9: 'CANCELADA',
    };

    return (data || []).map((item: any) => {
      const dateStr = this.inferDateFromItem(item);

      // estado textual preferido, cair para idStatus se houver
      let stateRaw = item.state ?? item.status ?? item.statusName ?? null;
      const idStatus = item.idStatus ?? item.statusId ?? item.StatusId ?? null;
      if (!stateRaw && idStatus != null) {
        const sid = Number(idStatus);
        stateRaw = statusMapById[sid] ?? stateRaw;
      }

      const stateNormalized = stateRaw
        ? this.normalizeStateForCompare(stateRaw)
        : null;

      return {
        ...item, // preserva campos originais
        idSolicitacao: item.idSolicitacao ?? item.ID ?? item.id ?? null,
        id: item.id ?? item.idSolicitacao ?? item.ID ?? null,
        createdAt: dateStr,
        requesterName: item.requesterName ?? item.name ?? item.nome ?? null,
        description: item.description ?? item.descricao ?? null,
        state: stateNormalized,
        redirectDestinationName:
          item.redirectDestinationName ?? item.destination ?? null,
        date: item.date ?? dateStr ?? null,
      } as User;
    });
  }

  /**
   * Heurística para encontrar um campo de data no objeto.
   * Retorna string|number|null (valor original detectado) — sem parse ainda.
   */
  inferDateFromItem(item: any): string | number | null {
    if (!item || typeof item !== 'object') return null;

    const candidates = [
      'createdAt',
      'created_at',
      'date',
      'data',
      'dataHora',
      'data_hora',
      'datahora',
      'created',
      'timestamp',
      'dt',
      'dt_criacao',
      'data_criacao',
      'dataHoraCriacao',
      'createdAtUtc',
      'createdAtLocal',
      'dataHoraEntrada',
    ];

    for (const key of candidates) {
      if (key in item) {
        const v = item[key];
        if (v != null && this.isParsableDate(v)) return v;
      }
    }

    // fallback: varre todas as propriedades
    for (const k of Object.keys(item)) {
      const v = item[k];
      if (v == null) continue;
      if (this.isParsableDate(v)) return v;
    }

    return null;
  }

  isParsableDate(v: any): boolean {
    if (typeof v === 'number') {
      // números grandes plausíveis como timestamp
      if (v > 1e8) return true;
      return false;
    }
    if (typeof v === 'string') {
      const s = v.trim();
      if (s.length === 0) return false;
      const parsed = Date.parse(s);
      if (!isNaN(parsed)) return true;
      if (/^\d{4}-\d{2}-\d{2}$/.test(s) || /^\d{4}\/\d{2}\/\d{2}$/.test(s))
        return true;
      if (/^\d{2}\/\d{2}\/\d{4}$/.test(s)) return true;
    }
    return false;
  }

  /**
   * Parse flexível que aceita number (s ou ms) e strings (ISO, DD/MM/YYYY, YYYYMMDD).
   * Retorna Date|null.
   */
  parseDate(value?: string | number | null): Date | null {
    if (value == null) return null;

    if (typeof value === 'number') {
      const v = value < 1e11 ? value * 1000 : value;
      const d = new Date(v);
      return isNaN(d.getTime()) ? null : d;
    }

    if (typeof value === 'string') {
      const s = value.trim();
      const dmY = /^(\d{2})\/(\d{2})\/(\d{4})(?:\s+.*)?$/;
      const m = s.match(dmY);
      let candidate = s;
      if (m) {
        candidate = `${m[3]}-${m[2]}-${m[1]}`;
      }

      const parsed = Date.parse(candidate);
      if (!isNaN(parsed)) return new Date(parsed);

      const ymd = candidate.match(/^(\d{4})(\d{2})(\d{2})$/);
      if (ymd) {
        const d = new Date(Number(ymd[1]), Number(ymd[2]) - 1, Number(ymd[3]));
        return isNaN(d.getTime()) ? null : d;
      }
    }

    return null;
  }

  // remove acentos e uppercase — idempotente
  private normalizeStateForCompare(s: string | null | undefined): string {
    if (!s) return '';
    return s
      .toString()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toUpperCase();
  }
}