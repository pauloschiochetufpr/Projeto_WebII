import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ReceitaPorDia {
  data: string;
  valorTotal: number;
  quantidadeSolicitacoes: number;
}

export interface ReceitaPorCategoria {
  categoria: string;
  receitaTotal: number;
  quantidade: number;
}

@Injectable({
  providedIn: 'root',
})
export class RelatorioService {
  private apiUrl = `${environment.apiUrl}/reports`;

  constructor(private http: HttpClient) {}

  obterReceitasPorPeriodo(
    dataInicio?: string,
    dataFim?: string
  ): Observable<ReceitaPorDia[]> {
    let params = new HttpParams();
    if (dataInicio) params = params.set('startDate', dataInicio);
    if (dataFim) params = params.set('endDate', dataFim);
    return this.http.get<ReceitaPorDia[]>(`${this.apiUrl}/revenue-by-period`, {
      params,
    });
  }

  // receita por Categoria
  obterReceitasPorCategoria(): Observable<ReceitaPorCategoria[]> {
    return this.http.get<ReceitaPorCategoria[]>(
      `${this.apiUrl}/revenue-by-category`
    );
  }

  baixarPdfReceitasPorPeriodo(
    dataInicio?: string,
    dataFim?: string
  ): Observable<Blob> {
    let params = new HttpParams();
    if (dataInicio) params = params.set('startDate', dataInicio);
    if (dataFim) params = params.set('endDate', dataFim);

    return this.http.get(`${this.apiUrl}/revenue-by-period/pdf`, {
      params,
      responseType: 'blob',
    });
  }

  baixarPdfReceitasPorCategoria(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/revenue-by-category/pdf`, {
      responseType: 'blob',
    });
  }
}
