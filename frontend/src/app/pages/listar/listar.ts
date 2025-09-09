// listar.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

import { JsonTestService } from '../../services/jsontest';

interface Entrada {
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
  
  get inicio(): number {
  return (this.paginaAtual - 1) * this.itensPorPagina;
}

  get fim(): number {
  return this.inicio + this.itensPorPagina;
}

  get totalPaginas(): number {
  return Math.ceil(this.users.length / this.itensPorPagina);
}
  
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
          return of([] as Entrada[]);
        })
      )
      .subscribe({
        next: (data: Entrada[]) => {
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
    this.router.navigate(['/pages/crud-workers/crud-workers.component'], { queryParams: { id } });
  }

  mudarPagina(direcao: number): void {
  this.paginaAtual = Math.min(Math.max(1, this.paginaAtual + direcao), this.totalPaginas);

 get listaFiltrada(): any[] {
    if (!this.users || this.users.length === 0) return [];

    const arr = this.users.slice();

    if (this.filtro === 'HOJE') {
      const now = new Date();
      const startTs = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
      const endTs = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999).getTime();
      return arr.filter(u => {
        const ts = Number(u.createdAtTs);
        return !isNaN(ts) && ts >= startTs && ts <= endTs;
      });
    }

    if (this.filtro === 'PERIODO') {
      if (!this.dateFromObj && !this.dateToObj) return [];

      const startTs = this.dateFromObj
        ? new Date(this.dateFromObj.getFullYear(), this.dateFromObj.getMonth(), this.dateFromObj.getDate()).getTime()
        : -8640000000000000;
      const endTs = this.dateToObj
        ? new Date(this.dateToObj.getFullYear(), this.dateToObj.getMonth(), this.dateToObj.getDate(), 23, 59, 59, 999).getTime()
        : 8640000000000000;

      return arr.filter(u => {
        const ts = Number(u.createdAtTs);
        return !isNaN(ts) && ts >= startTs && ts <= endTs;
      });
    }

    return arr;
  }
}

