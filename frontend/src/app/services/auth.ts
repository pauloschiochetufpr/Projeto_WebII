import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, map, catchError, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = environment.apiUrl;

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post(
      `${this.api}/login`,
      { email, password },
      { responseType: 'text' }
    );
  }

  cadastro(data: any): Observable<any> {
    return this.http.post(`${this.api}/cadastro`, data, {
      responseType: 'text',
    });
  }

  // Aqui estou usando API gratuita para verificação de email válido, assim já evita passar emails invalidos para as proximas etapas
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
}
