import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [NgIf, RouterLink],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  private readonly api = environment.apiUrl;
  isOpen = false;

  // Pegar do Token
  userName = 'Usuário';
  cargo: string | null = null;

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit() {
    this.extrairNomeDoAccessToken();
    this.extrairDadosDoToken();
  }

  open() {
    this.isOpen = true;
  }

  close() {
    this.isOpen = false;
  }

  logout() {
    const refreshToken = localStorage.getItem('refreshToken');

    if (!refreshToken) {
      console.error('Refresh token ausente. Logout abortado.');
      return;
    }

    this.http
      .post(`${this.api}/auth/logout`, {
        refreshToken: refreshToken,
      })
      .subscribe({
        next: (res: any) => {
          if (res?.code === 200) {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            this.router.navigate(['/login']);
          } else {
            console.error('Logout rejeitado pelo servidor:', res?.message);
          }
        },
        error: (err) => {
          console.error('Erro de logout:', err);
        },
      });
  }

  private extrairDadosDoToken() {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    try {
      const payload: any = jwtDecode(token);

      if (payload?.tipoUsuario) {
        this.cargo = payload.tipoUsuario;
      }
    } catch (e) {
      console.error('Falha ao decodificar token:', e);
    }
  }

  private extrairNomeDoAccessToken() {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    try {
      const payload: any = jwtDecode(token);

      if (payload?.nome) {
        this.userName = payload.nome;
      }
    } catch (e) {
      console.error('Falha ao decodificar o token JWT:', e);
    }
  }
}
