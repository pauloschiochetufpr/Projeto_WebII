import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { Observable, map, catchError, of } from 'rxjs';

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}

interface BasicResponse {
  code: number;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = environment.apiUrl;

  constructor(private http: HttpClient, private router: Router) {}

  login(
    email: string,
    password: string
  ): Observable<AuthResponse | BasicResponse> {
    return this.http
      .post(
        `${this.api}/auth/login`,
        { email, senha: password },
        { responseType: 'text' }
      )
      .pipe(
        map((res) => {
          const data = JSON.parse(res);

          // Caso AuthResponse
          if ('accessToken' in data && 'refreshToken' in data) {
            // Salva tokens em localstorage
            localStorage.setItem('accessToken', data.accessToken);
            localStorage.setItem('refreshToken', data.refreshToken);

            // Redirecionar para home
            this.router.navigate(['/']);

            return data as AuthResponse;
          }

          // Caso BasicResponse
          return data as BasicResponse;
        }),
        catchError((err) => {
          try {
            // Caso JSON
            const parsedError =
              typeof err.error === 'string' ? JSON.parse(err.error) : err.error;

            // Verifica se parece um BasicResponse
            if (parsedError && parsedError.code && parsedError.message) {
              return of(parsedError as BasicResponse);
            }

            // Caso BasicResponse
            if (typeof err.error === 'string') {
              return of({
                code: err.status || 500,
                message: err.error,
              } as BasicResponse);
            }
          } catch {
            // Ignorar
          }

          // Fallback genérico
          return of({
            code: err.status || 500,
            message: 'Erro interno do servidor',
          } as BasicResponse);
        })
      );
  }

  cadastro(data: any): Observable<{ code: number; message: string }> {
    return this.http.post<{ code: number; message: string }>(
      `${this.api}/auth/cadastro`,
      data
    );
  }

  // Tirei a api, a API caiu :(
  validarEmail(email: string): Observable<any> {
    return this.http.get(`${this.api}/validate-email`, { params: { email } });
  }

  validarTelefone(telefone: string): Observable<boolean> {
    return this.http
      .get<{ valido: boolean }>(`${this.api}/validate-phone`, {
        params: { telefone },
      })
      .pipe(
        map((res) => res.valido),
        catchError(() => of(false))
      );
  }

  validarCep(cep: string): Observable<any> {
    return this.http
      .get(`${this.api}/validate-cep`, { params: { cep } })
      .pipe(catchError(() => of(null)));
  }
}
