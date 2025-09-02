import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

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
}
