import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CategoriaEquipamento } from '../models/solicitacao.model';
import { DatePicker } from '../components';

@Injectable({
  providedIn: 'root'
})
export class CategoriaEquipamentoService {

  BASE_URL = "https://localhost:8443/api/categorias";

  
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) {}

  listarTodos(): Observable<CategoriaEquipamento[]> {
    return this.http.get<CategoriaEquipamento[]>(this.BASE_URL);
  }

  inserir(categoria: CategoriaEquipamento): Observable<CategoriaEquipamento> {
    return this.http.post<CategoriaEquipamento>(this.BASE_URL, categoria);
  }

  atualizar(categoria: CategoriaEquipamento): Observable<CategoriaEquipamento> {
    return this.http.put<CategoriaEquipamento>(`${this.BASE_URL}/${categoria.id}`, categoria);
  }

  remover(id: number): Observable<void> {
    return this.http.delete<void>(`${this.BASE_URL}/${id}`);
  }

  buscarPorId(id: number): Observable<CategoriaEquipamento> {
    return this.http.get<CategoriaEquipamento>(`${this.BASE_URL}/${id}`);
  }
}
