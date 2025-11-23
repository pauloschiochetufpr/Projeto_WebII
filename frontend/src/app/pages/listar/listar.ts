import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { forkJoin, of } from 'rxjs';
import { catchError, map, take } from 'rxjs/operators';
import { RouterModule } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { SolicitacaoService, SolicitacaoDto } from '../../services/solicitacao';
import { JsonTestService } from '../../services/jsontest';
import { DateSelection } from '../../services/date-selection';
import { RangeDatePicker } from '../../components/range-date-picker/range-date-picker';
import { VisualizarServicosDialog } from '../../components/visualizar-servico-dialog/visualizar-servicos-dialog';
import { jwtDecode } from 'jwt-decode';

interface DisplayUser {
  id?: number | string | null;
  createdAt?: string | number | null;
  requesterName?: string | null;
  description?: string | null;
  state?: string | null;
  redirectDestinationName?: string | null;
  budget?: number | null;
  history?: { state: string; date: string; by?: string; note?: string }[];
  lastUpdate?: string | null;
}

@Component({
  selector: 'app-listar',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    RouterModule,
    RangeDatePicker,
    MatDialogModule,
  ],
  templateUrl: './listar.html',
  styleUrls: ['./listar.css'],
})
export class Listar implements OnInit {
  users: DisplayUser[] = [];
  id: number | undefined;
  loading = false;
  error: string | null = null;
  summary = 'Pressione "Atualizar" para carregar';
  periodStartMs: number | null = null;
  periodEndMs: number | null = null;

  filtro: 'HOJE' | 'TODAS' | 'PERIODO' = 'HOJE';
  searchClient: string = '';
  searchState: string = '';

  currentEmployeeDestinationName: string | null = 'Oficina Centro';

  constructor(
    private solicitacaoService: SolicitacaoService,
    private jsonService: JsonTestService,
    public dateSelection: DateSelection,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.onRefresh();
  }

  // 🔹 Busca no back-end
  onRefresh(): void {
    this.loading = true;
    this.error = null;
    this.summary = 'Carregando...';
    this.users = [];

    this.extrairDadosDoToken();

    this.solicitacaoService
      .listarPorFuncionarioComLastUpdate(this.id!)
      .pipe(take(1))
      .subscribe({
        next: (data: any[]) => {
          const normalized = data.map((s) => ({
            id: s.idSolicitacao,
            createdAt:
              s.lastUpdate ??
              s.createdAt ??
              s['dataHora'] ??
              new Date().toISOString(),
            requesterName: s.cliente?.nome ?? `Cliente #${s.idCliente}`,
            description: s.descricao,
            state: this.solicitacaoService.mapStatus(s.idStatus),
            redirectDestinationName: '-',
            budget: s.valor,
            lastUpdate: s.lastUpdate ?? null,
          }));

          this.users = normalized;
          this.computePeriodFromSelection();
          this.loading = false;
          this.summary = `${this.users.length} registro(s) carregado(s)`;

          console.log(
            'Solicitações recebidas do backend (com lastUpdate):',
            data
          );
        },
        error: (err) => {
          console.error('Erro ao buscar solicitações:', err);
          this.error = 'Erro ao buscar solicitações';
          this.loading = false;
          this.summary = '';
        },
      });
  }

  // 🔹 Funções auxiliares de data (delegando para o JsonTestService)
  private parseDate(value?: string | number | null): Date | null {
    return this.jsonService.parseDate(value);
  }

  private getLastHistoryDate(history: any[]): string | null {
    if (!history || history.length === 0) return null;

    const dates = history
      .map((h) => h.dataHora)
      .filter(Boolean)
      .map((d) => new Date(d).getTime())
      .filter((t) => !isNaN(t));

    if (dates.length === 0) return null;

    return new Date(Math.max(...dates)).toISOString();
  }

  private fillLastUpdate(): void {
    if (!this.users || this.users.length === 0) {
      this.loading = false;
      return;
    }

    const calls = this.users.map((u) => {
      const id = u.id ?? null;
      if (!id) return of(null); // sem id, pula e retorna null

      // garante que id seja number
      const idNum = Number(id);
      if (isNaN(idNum)) return of(null);

      return this.solicitacaoService.getHistorico(idNum).pipe(
        map((hist) => this.getLastHistoryDate(hist as any)),
        catchError((err) => {
          console.warn('Erro ao buscar histórico para id', idNum, err);
          return of(null);
        })
      );
    });

    forkJoin(calls).subscribe({
      next: (lastDates) => {
        this.users = this.users.map((u, i) => ({
          ...u,
          // prefere lastDates[i], senão createdAt como fallback
          lastUpdate:
            lastDates[i] ??
            (u.createdAt ? new Date(String(u.createdAt)).toISOString() : null),
        }));

        // Reordena pela última atualização (crescente)
        this.users.sort((a, b) => {
          const ta = a.lastUpdate ? new Date(a.lastUpdate).getTime() : 0;
          const tb = b.lastUpdate ? new Date(b.lastUpdate).getTime() : 0;
          return ta - tb;
        });

        this.loading = false;
      },
      error: (err) => {
        console.error('Erro ao agregar históricos', err);
        // fallback: apenas transforma createdAt para ISO (se possível)
        this.users = this.users.map((u) => ({
          ...u,
          lastUpdate: u.createdAt
            ? new Date(String(u.createdAt)).toISOString()
            : null,
        }));
        this.loading = false;
      },
    });
  }

  private isSameDay(a: Date, b: Date): boolean {
    return (
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate()
    );
  }

  private computePeriodFromSelection(): void {
    this.periodStartMs = null;
    this.periodEndMs = null;

    const rangeSql = this.dateSelection.getRangeSql();

    if (rangeSql?.start) {
      const [y, m, d] = rangeSql.start.split('-').map(Number);
      this.periodStartMs = new Date(y, m - 1, d, 0, 0, 0, 0).getTime();
    }
    if (rangeSql?.end) {
      const [y, m, d] = rangeSql.end.split('-').map(Number);
      this.periodEndMs = new Date(y, m - 1, d, 23, 59, 59, 999).getTime();
    }
  }

  // 🔹 Normalizações
  private normalizeTextForCompare(s?: string | null): string {
    if (!s) return '';
    return s
      .toString()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toUpperCase();
  }

  isState(u: DisplayUser, expected: string): boolean {
    return (
      this.normalizeTextForCompare(u.state) ===
      this.normalizeTextForCompare(expected)
    );
  }

  private redirectAllowed(u: DisplayUser): boolean {
    if (this.normalizeTextForCompare(u.state) !== 'REDIRECIONADA') return true;
    return (
      this.normalizeTextForCompare(u.redirectDestinationName) ===
      this.normalizeTextForCompare(this.currentEmployeeDestinationName)
    );
  }

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

  // Filtro visual aplicado no HTML
  get listaFiltrada(): DisplayUser[] {
    if (!this.users || this.users.length === 0) return [];

    let base = [...this.users];

    if (this.searchClient.trim() !== '') {
      const q = this.searchClient.toLowerCase();
      base = base.filter((u) =>
        (u.requesterName ?? '').toLowerCase().includes(q)
      );
    }

    if (this.searchState.trim() !== '') {
      const q = this.searchState.toLowerCase();
      base = base.filter((u) => (u.state ?? '').toLowerCase().includes(q));
    }

    if (this.filtro === 'HOJE') {
      const today = new Date();
      base = base.filter((u) => {
        const d = this.parseDate(u.createdAt ?? null);
        return d ? this.isSameDay(d, today) : false;
      });
    }

    if (this.filtro === 'PERIODO') {
      const startMs = this.periodStartMs;
      const endMs = this.periodEndMs;
      base = base.filter((u) => {
        const d = this.parseDate(u.createdAt ?? null);
        if (!d) return false;
        const t = d.getTime();
        if (startMs && t < startMs) return false;
        if (endMs && t > endMs) return false;
        return true;
      });
    }

    base = base.filter((u) => this.redirectAllowed(u));

    return base.sort((a, b) => {
      const da = this.parseDate(a.createdAt)?.getTime() ?? 0;
      const db = this.parseDate(b.createdAt)?.getTime() ?? 0;
      return da - db;
    });
  }

  // 🔹 Abre o dialog e aplica os updates locais
  abrirVisualizar(user: DisplayUser) {
    const ref = this.dialog.open(VisualizarServicosDialog, {
      width: '700px',
      data: {
        user,
        action: 'VISUALIZAR',
        currentDestination: this.currentEmployeeDestinationName,
      },
    });

    ref.afterClosed().subscribe((result: any) => {
      if (!result) return;

      const idx = this.users.findIndex(
        (u) => String(u.id) === String(result.user?.id)
      );
      if (idx === -1) return;

      //ajeitar
      switch (result.action) {
        case 'ORÇAR':
          this.users[idx].state = 'ORÇADA';
          this.users[idx].budget = result.budget;
          break;
        case 'APROVAR':
          this.users[idx].state = 'APROVADA';
          break;
        case 'REJEITAR':
          this.users[idx].state = 'REJEITADA';
          break;
        case 'RESGATAR':
          this.users[idx].state = 'APROVADA';
          break;
        case 'ARRUMAR':
          this.users[idx].state = 'ARRUMADA';
          break;
        case 'REDIRECIONAR':
          this.users[idx].state = 'REDIRECIONADA';
          this.users[idx].redirectDestinationName =
            result.destino === 'CURRENT'
              ? this.currentEmployeeDestinationName
              : result.destino ?? this.users[idx].redirectDestinationName;
          break;
        case 'PAGAR':
          this.users[idx].state = 'PAGA';
          break;
        case 'FINALIZAR':
          this.users[idx].state = 'FINALIZADA';
          break;
      }
      this.users[idx].history = [
        ...(this.users[idx].history ?? []),
        {
          state: this.users[idx].state!,
          date: new Date().toISOString(),
          by: 'FUNCIONÁRIO',
        },
      ];
      this.onRefresh();
    });
  }

  // 🔹 Totais
  get totalSolicitacoes(): number {
    return this.users.length;
  }

  get totalPendentes(): number {
    return this.users.filter((u) => u.state && u.state !== 'FINALIZADA').length;
  }

  get totalConcluidas(): number {
    return this.users.filter((u) => u.state === 'FINALIZADA').length;
  }

  get totalHoje(): number {
    const hoje = new Date();
    return this.users.filter((u) => {
      const d = this.parseDate(u.createdAt);
      return (
        d &&
        d.getDate() === hoje.getDate() &&
        d.getMonth() === hoje.getMonth() &&
        d.getFullYear() === hoje.getFullYear()
      );
    }).length;
  }

  private extrairDadosDoToken() {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    try {
      const payload: any = jwtDecode(token);

      if (payload?.id) {
        this.id = payload.id;
      }
    } catch (e) {
      console.error('Falha ao decodificar token:', e);
    }
  }
}
