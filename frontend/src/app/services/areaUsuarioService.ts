import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

export interface ChangeCredentialRequest {
  email: string | null;
  senha: string | null;
  token: string;
}

@Injectable({
  providedIn: 'root',
})
export class AreaUsuarioService {
  private readonly api = environment.apiUrl;

  constructor(private http: HttpClient) {}

  alterarCredenciais(data: ChangeCredentialRequest): Observable<any> {
    return this.http.post(`${this.api}/prof/`, data);
  }
}
