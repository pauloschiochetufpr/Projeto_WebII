import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

import { JsonTestService, User } from '../../services/jsontest';

@Component({
  selector: 'app-listar',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './listar.html',
  styleUrls: ['./listar.css'],
})

//funcao basica pra ler e mostrar um json na tela
export class Listar {
  users: User[] = [];
  loading = false;
  error: string | null = null;
  summary = 'Pressione "Atualizar" para carregar';

  constructor(private jsonService: JsonTestService) {}

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
          return of([] as User[]);
        })
      )
      .subscribe({
        next: (data: User[]) => {
          this.users = data || [];
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
}
