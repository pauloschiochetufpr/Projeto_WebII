import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { catchError, map, take } from 'rxjs/operators';
import { of } from 'rxjs';
import { RouterModule } from '@angular/router';

import { JsonTestService, User } from '../../services/jsontest';
import { DateSelection } from '../../services/date-selection';
import { RangeDatePicker } from '../../components/range-date-picker/range-date-picker';
import { FuncHeader } from '../../components/func-header/func-header';

interface DisplayUser {
  id?: number | string | null;
  idSolicitacao?: number | string | null;
  createdAt?: string | number | null;
  requesterName?: string | null;
  description?: string | null;
  state?: string | null;
  redirectDestinationName?: string | null;
  name?: string | null;
  date?: string | null;
  raw?: any;
}

@Component({
  selector: 'app-listar',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    RangeDatePicker,
    FuncHeader,
    RouterModule,
  ],
  templateUrl: './listar.html',
  styleUrls: ['./listar.css'],
})
export class Listar implements OnInit {
  users: DisplayUser[] = [];
  loading = false;
  error: string | null = null;
  summary = 'Pressione "Atualizar" para carregar';
  periodStartMs: number | null = null;
  periodEndMs: number | null = null;

  filtro: 'HOJE' | 'TODAS' | 'PERIODO' = 'HOJE';

  // filtros extras
  searchClient: string = '';
  searchState: string = '';

  // Substituir quando tiver AuthService: preencher com o destino/nome do funcionário
  currentEmployeeDestinationName: string | null = 'Oficina Centro';

  constructor(
    private jsonService: JsonTestService,
    private dateSelection: DateSelection
  ) {}

  ngOnInit(): void {
    this.onRefresh(); // chama o refresh ao carregar o componente
  }

  /**
   * Recarrega os dados do serviço e aplica normalização (via service).
   */
  onRefresh(): void {
    this.loading = true;
    this.error = null;
    this.summary = 'Carregando...';
    this.users = [];

    // força recarregar do assets (apaga localStorage interno e fará http.get)
    this.jsonService.resetMockFromAssets();

    // aguarda a próxima emissão do users$ (take(1)) após o fetch do serviço
    this.jsonService.users$.pipe(take(1)).subscribe({
      next: (data: any[]) => {
        // O service já normaliza em fetchFromAssets(), mas chamamos normalizeUsers para garantir
        const normalized = this.jsonService.normalizeUsers(data || []);

        // ordenar crescente por data/hora usando parseDate do service
        normalized.sort((a: any, b: any) => {
          const da =
            this.jsonService
              .parseDate(a.createdAt ?? a.date ?? null)
              ?.getTime() ?? 0;
          const db =
            this.jsonService
              .parseDate(b.createdAt ?? b.date ?? null)
              ?.getTime() ?? 0;
          return da - db;
        });

        // atribui a lista normalizada
        this.users = normalized as DisplayUser[];

        // calcula o período (cache) a partir do DateSelection atual
        this.computePeriodFromSelection();

        this.loading = false;
        this.summary = `${this.users.length} registro(s) carregado(s)`;
      },
      error: (err: any) => {
        console.error('Erro ao recarregar dados', err);
        this.error = 'Erro desconhecido';
        this.loading = false;
        this.summary = '';
      },
    });
  }

  // ---------- getters que o template usa (re-adicionados) ----------
  get totalSolicitacoes(): number {
    return this.users.length;
  }

  get totalPendentes(): number {
    // considera como pendentes os estados que ainda estão "ativos" ou aguardando ação
    const pendentes = [
      'ABERTA',
      'ORCADA',
      'REJEITADA',
      'APROVADA',
      'REDIRECIONADA',
      'ARRUMADA',
      'PAGA',
    ];
    return this.users.filter((u) => {
      const st = this.normalizeTextForCompare(u.state);
      return st && pendentes.includes(st);
    }).length;
  }

  get totalConcluidas(): number {
    return this.users.filter(
      (u) => this.normalizeTextForCompare(u.state) === 'FINALIZADA'
    ).length;
  }

  get totalHoje(): number {
    const today = new Date();
    return this.users.filter((u) => {
      const d = this.parseDate(u.createdAt ?? u.date ?? null);
      return d ? this.isSameDay(d, today) : false;
    }).length;
  }

  // ---------- utilitários de data (delegam ao service quando útil) ----------
  private parseDate(value?: string | number | null): Date | null {
    // usa o parse flexível do service
    return this.jsonService.parseDate(value);
  }

  private isSameDay(a: Date, b: Date): boolean {
    return (
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate()
    );
  }

  // ---------- período (cache) ----------
  private computePeriodFromSelection(): void {
    // reset
    this.periodStartMs = null;
    this.periodEndMs = null;

    const rangeJs = this.dateSelection.getRange(); // Date objects
    const rangeSql = this.dateSelection.getRangeSql(); // strings YYYY-MM-DD

    if (
      (!rangeJs && !rangeSql) ||
      (rangeJs &&
        !rangeJs.start &&
        !rangeJs.end &&
        rangeSql &&
        !rangeSql.start &&
        !rangeSql.end)
    ) {
      // nada definido
      return;
    }

    if (rangeSql && (rangeSql.start || rangeSql.end)) {
      if (rangeSql.start) {
        const [y, m, d] = rangeSql.start.split('-').map(Number);
        const s = new Date(y, m - 1, d, 0, 0, 0, 0);
        this.periodStartMs = s.getTime();
      }
      if (rangeSql.end) {
        const [y, m, d] = rangeSql.end.split('-').map(Number);
        const e = new Date(y, m - 1, d, 23, 59, 59, 999);
        this.periodEndMs = e.getTime();
      }
      return;
    }

    if (rangeJs) {
      if (rangeJs.start) {
        const s = new Date(
          rangeJs.start.getFullYear(),
          rangeJs.start.getMonth(),
          rangeJs.start.getDate(),
          0,
          0,
          0,
          0
        );
        this.periodStartMs = s.getTime();
      }
      if (rangeJs.end) {
        const e = new Date(
          rangeJs.end.getFullYear(),
          rangeJs.end.getMonth(),
          rangeJs.end.getDate(),
          23,
          59,
          59,
          999
        );
        this.periodEndMs = e.getTime();
      }
    }
  }

  // normalização simples de texto para comparação (remove acentos e uppercase)
  private normalizeTextForCompare(s?: string | null): string {
    if (!s) return '';
    return s
      .toString()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toUpperCase();
  }

  // re-adiciona isState que o template espera: aceita DisplayUser e texto esperado
  isState(u: DisplayUser, expected: string): boolean {
    if (!u) return false;
    return (
      this.normalizeTextForCompare(u.state) ===
      this.normalizeTextForCompare(expected)
    );
  }

  // somente exibir redirecionadas se o funcionário for o destino
  private redirectAllowed(u: DisplayUser): boolean {
    if (!u.state) return true;
    if (this.normalizeTextForCompare(u.state) !== 'REDIRECIONADA') return true;
    if (!this.currentEmployeeDestinationName) return false;
    return (
      this.normalizeTextForCompare(u.redirectDestinationName) ===
      this.normalizeTextForCompare(this.currentEmployeeDestinationName)
    );
  }

  // mapping estado -> classes Tailwind para badge (comportamento local)
  getStatusClass(state?: string | null): string {
    const st = this.normalizeTextForCompare(state);
    switch (st) {
      case 'ABERTA':
        return 'bg-gray-300 text-gray-800';
      case 'ORCADA':
        return 'bg-amber-800 text-white';
      case 'REJEITADA':
        return 'bg-red-500 text-white';
      case 'APROVADA':
        return 'bg-yellow-300 text-black';
      case 'REDIRECIONADA':
        return 'bg-purple-600 text-white';
      case 'ARRUMADA':
        return 'bg-blue-500 text-white';
      case 'PAGA':
        return 'bg-orange-500 text-white';
      case 'FINALIZADA':
        return 'bg-green-500 text-white';
      default:
        return 'bg-gray-200 text-gray-800';
    }
  }

  // getter que o template usa: listaFiltrada
  get listaFiltrada(): DisplayUser[] {
    if (!this.users || this.users.length === 0) return [];

    let base = this.users;

    // filtros simples: cliente / estado (antes do período para reduzir iteração)
    if (this.searchClient && this.searchClient.trim() !== '') {
      const q = this.searchClient.trim().toLowerCase();
      base = base.filter((u) =>
        (u.requesterName ?? u.name ?? '').toString().toLowerCase().includes(q)
      );
    }

    if (this.searchState && this.searchState.trim() !== '') {
      const q = this.searchState.trim().toLowerCase();
      base = base.filter((u) =>
        (u.state ?? '').toString().toLowerCase().includes(q)
      );
    }

    // aplica filtro HOJE
    if (this.filtro === 'HOJE') {
      const today = new Date();
      const startOfToday = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        0,
        0,
        0,
        0
      ).getTime();
      const endOfToday = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        23,
        59,
        59,
        999
      ).getTime();

      base = base.filter((u) => {
        const d = this.parseDate(u.createdAt ?? u.date ?? null);
        if (!d) return false;
        const t = d.getTime();
        return t >= startOfToday && t <= endOfToday;
      });
    }

    // aplica filtro PERIODO
    if (this.filtro === 'PERIODO') {
      if (this.periodStartMs === null && this.periodEndMs === null)
        this.computePeriodFromSelection();
      if (this.periodStartMs === null && this.periodEndMs === null) return [];

      const startMs = this.periodStartMs;
      const endMs = this.periodEndMs;

      base = base.filter((u) => {
        const d = this.parseDate(u.createdAt ?? u.date ?? null);
        if (!d) return false;
        const t = d.getTime();
        if (startMs != null && endMs != null) return t >= startMs && t <= endMs;
        if (startMs != null) return t >= startMs;
        if (endMs != null) return t <= endMs;
        return false;
      });
    }

    // filtrar redirecionadas por destino do funcionário
    base = base.filter((u) => this.redirectAllowed(u));

    // garantir ordenação crescente por data/hora (em caso de re-filtro)
    base = base.slice().sort((a, b) => {
      const da = this.parseDate(a.createdAt ?? a.date ?? null)?.getTime() ?? 0;
      const db = this.parseDate(b.createdAt ?? b.date ?? null)?.getTime() ?? 0;
      return da - db;
    });

    return base;
  }
}
