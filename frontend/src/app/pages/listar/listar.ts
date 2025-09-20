import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';

import { JsonTestService, User } from '../../services/jsontest';
import { DateSelection } from '../../services/date-selection';
import { RangeDatePicker } from '../../components/range-date-picker/range-date-picker';

import { FuncHeader } from '../../components/func-header/func-header';

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
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    RangeDatePicker,
    FuncHeader,
  ],
  templateUrl: './listar.html',
  styleUrls: ['./listar.css'],
})
export class Listar {
  // agora trabalhamos com DisplayUser, que tem todos os campos do template
  users: DisplayUser[] = [];
  loading = false;
  error: string | null = null;
  summary = 'Pressione "Atualizar" para carregar';

  filtro: 'TODAS' | 'HOJE' | 'PERIODO' = 'TODAS';

  constructor(
    private jsonService: JsonTestService,
    private dateSelection: DateSelection
  ) {}

  onRefresh(): void {
    this.loading = true;
    this.error = null;
    this.summary = 'Carregando...';
    this.users = [];

    this.jsonService
      .getUsers()
      .pipe(
        // se houver erro, retornar array vazio (catchError)
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
          // Normalizar cada item para o formato DisplayUser que o template espera
          this.users = (data || []).map((item: any, idx: number) => {
            // usar date (se existir) como createdAt para manter compatibilidade com template
            const dateStr =
              item.date ?? item.createdAt ?? item.created_at ?? null;

            return {
              idSolicitacao: item.idSolicitacao ?? item.ID ?? null,
              createdAt: dateStr,
              requesterName: item.requesterName ?? item.name ?? null,
              description: item.description ?? item.descricao ?? null,
              state: item.state ?? item.status ?? null,
              redirectDestinationName:
                item.redirectDestinationName ?? item.destination ?? null,
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
    return (
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate()
    );
  }

  // getter que o template usa: listaFiltrada
  get listaFiltrada(): DisplayUser[] {
    if (!this.users || this.users.length === 0) return [];

    if (this.filtro === 'TODAS') return this.users;

    // filtro principal
    if (this.filtro === 'HOJE') {
      const today = new Date();
      return this.users.filter((u) => {
        const d = this.parseDate(u.createdAt ?? u.date ?? null);
        return d ? this.isSameDay(d, today) : false;
      });
    }

    if (this.filtro === 'PERIODO') {
      const range = this.dateSelection.getRange();
      if (!range || (!range.start && !range.end)) {
        // sem range definido, retorna vazio (padrão atual). Pode alterar se preferir.
        return [];
      }

      const start = range.start ? new Date(range.start) : null;
      const end = range.end ? new Date(range.end) : null;

      return this.users.filter((u) => {
        const d = this.parseDate(u.createdAt ?? u.date ?? null);
        if (!d) return false;

        if (start && !end) return d >= start;
        if (!start && end) return d <= end;
        if (start && end) {
          const da = new Date(
            d.getFullYear(),
            d.getMonth(),
            d.getDate()
          ).getTime();
          const sa = new Date(
            start.getFullYear(),
            start.getMonth(),
            start.getDate()
          ).getTime();
          const ea = new Date(
            end.getFullYear(),
            end.getMonth(),
            end.getDate()
          ).getTime();
          return da >= sa && da <= ea;
        }
        return false;
      });
    }

    return this.users;
  }
}
