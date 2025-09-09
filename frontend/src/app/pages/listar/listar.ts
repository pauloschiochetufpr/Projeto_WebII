// listar.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

import { JsonTestService } from '../../services/jsontest';

interface RawEntry {
  name?: string;
  date?: string;
  id?: string;
  description?: string;
  state?: string;
  redirectDestinationName?: string;
  requesterName?: string;
  createdAt?: string;
}

@Component({
  selector: 'app-listar',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './listar.html',
  styleUrls: ['./listar.css'],
})
export class Listar {
  users: any[] = [];
  loading = false;
  error: string | null = null;
  summary = 'Pressione "Atualizar" para carregar';
  filtro: 'TODAS' | 'HOJE' | 'PERIODO' = 'TODAS';
  dateFrom?: string;
  dateTo?: string;

  constructor(private router: Router, private jsonService: JsonTestService) {}

  onRefresh(): void {
    this.loading = true;
    this.error = null;
    this.summary = 'Carregando...';
    this.users = [];

    this.jsonService.getUsers()
      .pipe(
        catchError((err: any) => {
          console.error('Erro ao carregar JSON', err);
          this.error = 'Erro ao carregar JSON';
          this.loading = false;
          return of([] as RawEntry[]);
        })
      )
      .subscribe({
        next: (data: RawEntry[]) => {
          this.users = (data || []).map((r, idx) => ({
            ...r,
            id: r.id ?? `r${idx + 1}`,
            createdAt: r.createdAt ?? r.date ?? new Date().toISOString(),
            requesterName: r.requesterName ?? r.name ?? '-'
          }));
          this.loading = false;
          this.summary = `${this.users.length} registro(s) carregado(s)`;
        },
        error: (err: any) => {
          console.error('Subscribe erro', err);
          this.error = 'Erro desconhecido';
          this.loading = false;
          this.summary = '';
        }
      });
  }

  goToMostrarSolicitacao(item: any): void {
    const id = item?.id ?? item?.requesterName ?? item?.name ?? null;
    this.router.navigate(['/mostrarsolicitacoes'], { queryParams: { id } });
  }

  get listaFiltrada(): any[] {
    if (!this.users || this.users.length === 0) return [];
    const arr = this.users.slice();
    const toDate = (d: any): Date => {
      if (!d) return new Date(NaN);
      if (d instanceof Date) return d;
      return new Date(d);
    };
    if (this.filtro === 'HOJE') {
      const now = new Date();
      const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const end = new Date(start);
      end.setDate(start.getDate() + 1);
      return arr.filter(u => {
        const d = toDate(u.createdAt || u.date);
        return !isNaN(d.getTime()) && d >= start && d < end;
      });
    }
    if (this.filtro === 'PERIODO') {
      if (!this.dateFrom && !this.dateTo) return [];
      const start = this.dateFrom ? new Date(this.dateFrom) : new Date(-8640000000000000);
      const end = this.dateTo ? new Date(this.dateTo) : new Date(8640000000000000);
      end.setDate(end.getDate() + 1);
      return arr.filter(u => {
        const d = toDate(u.createdAt || u.date);
        return !isNaN(d.getTime()) && d >= start && d < end;
      });
    }
    return arr;
  }
}
