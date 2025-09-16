import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';

import { JsonTestService, User } from '../../services/jsontest';
import { DateSelection } from '../../services/date-selection';
import { RangeDatePicker } from '../../components/range-date-picker/range-date-picker';

interface DisplayUser {
  id?: number | string | null;
  createdAt?: string | null;
  requesterName?: string | null;
  description?: string | null;
  state?: string | null;
  redirectDestinationName?: string | null;
  name?: string | null;
  date?: string | null;
}

@Component({
  selector: 'app-listar',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, RangeDatePicker],
  templateUrl: './listar.html',
  styleUrls: ['./listar.css'],
})
export class Listar {
  users: DisplayUser[] = [];
  loading = false;
  error: string | null = null;
  summary = 'Pressione "Atualizar" para carregar';

  filtro: 'TODAS' | 'HOJE' | 'PERIODO' = 'TODAS';

  // filtros extras
  searchClient = '';
  searchState = '';

  // --- modal ---
  modalOpen: boolean = false;
  modalDescription: string = '';
  modalUser: DisplayUser | null = null;

  constructor(
    private jsonService: JsonTestService,
    private dateSelection: DateSelection
  ) {}

  get totalSolicitacoes(): number {
  return this.users?.length ?? 0;
}

get totalPendentes(): number {
  return this.users?.filter(u => u.state === 'Pendente').length ?? 0;
}

get totalConcluidas(): number {
  return this.users?.filter(u => u.state === 'Concluído').length ?? 0;
}

get totalHoje(): number {
  return this.listaFiltrada?.length ?? 0;
}

  onRefresh(): void {
    this.loading = true;
    this.error = null;
    this.summary = 'Carregando...';
    this.users = [];

    this.jsonService
      .getUsers()
      .pipe(
        catchError((err: any) => {
          console.error('Erro ao carregar JSON', err);
          this.error = 'Erro ao carregar JSON';
          this.loading = false;
          return of([] as User[]);
        }),
        map((res: any) => {
          const arr = Array.isArray(res) ? res : res?.data ?? res?.items ?? [];
          return arr;
        })
      )
      .subscribe({
        next: (data: any[]) => {
          this.users = (data || []).map((item: any) => {
            const dateStr = item.date ?? item.createdAt ?? item.created_at ?? null;
            return {
              id: item.id ?? item.ID ?? null,
              createdAt: dateStr,
              requesterName: item.requesterName ?? item.name ?? null,
              description: item.description ?? item.desc ?? null,
              state: item.state ?? item.status ?? null,
              redirectDestinationName: item.redirectDestinationName ?? item.destination ?? null,
              name: item.name ?? null,
              date: item.date ?? dateStr ?? null,
            } as DisplayUser;
          });

          this.loading = false;
          this.summary = `${this.users.length} registro(s) carregado(s)`;
        },
        error: (err: any) => {
          console.error('Subscribe erro', err);
          this.error = 'Erro desconhecido';
          this.loading = false;
          this.summary = '';
        },
      });
  }

  private parseDate(value?: string | null): Date | null {
    if (!value) return null;
    const d = new Date(value);
    return isNaN(d.getTime()) ? null : d;
  }

  private isSameDay(a: Date, b: Date): boolean {
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  }

  get listaFiltrada(): DisplayUser[] {
    let filtered = this.users;

    // filtro principal
    if (this.filtro === 'HOJE') {
      const today = new Date();
      filtered = filtered.filter(u => {
        const d = this.parseDate(u.createdAt ?? u.date ?? null);
        return d ? this.isSameDay(d, today) : false;
      });
    } else if (this.filtro === 'PERIODO') {
      const range = this.dateSelection.getRange();
      if (!range || (!range.start && !range.end)) return [];
      const start = range.start ? new Date(range.start) : null;
      const end = range.end ? new Date(range.end) : null;
      filtered = filtered.filter(u => {
        const d = this.parseDate(u.createdAt ?? u.date ?? null);
        if (!d) return false;
        if (start && !end) return d >= start;
        if (!start && end) return d <= end;
        if (start && end) {
          const da = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
          const sa = new Date(start.getFullYear(), start.getMonth(), start.getDate()).getTime();
          const ea = new Date(end.getFullYear(), end.getMonth(), end.getDate()).getTime();
          return da >= sa && da <= ea;
        }
        return true;
      });
    }

    // filtros extras
    if (this.searchClient) {
      filtered = filtered.filter(u => u.requesterName?.toLowerCase().includes(this.searchClient.toLowerCase()));
    }
    if (this.searchState) {
      filtered = filtered.filter(u => u.state === this.searchState);
    }

    return filtered;
  }

 // Botões extras
  enviarParaAprovacao(user?: DisplayUser) {
    alert(`Enviar solicitação ID ${user?.id} para aprovação`);
  }

  // --- parte dos modal ---
  openModal(description?: string | null, user?: DisplayUser): void {
    this.modalDescription = description ?? '';
    this.modalUser = user ?? null;
    this.modalOpen = true;
  }

  closeModal(): void {
    this.modalOpen = false;
    this.modalDescription = '';
    this.modalUser = null;
  }

  copyDescription(desc?: string | null) {
    if (desc) navigator.clipboard.writeText(desc);
  }
}
