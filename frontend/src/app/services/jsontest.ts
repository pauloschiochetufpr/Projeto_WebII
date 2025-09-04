import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Interface ampliada e com campos opcionais para casar com o template
export interface User {
  // campos que você já tinha
  name?: string;
  date?: string;
}

@Injectable({
  providedIn: 'root',
})
export class JsonTestService {
  private jsonUrl = 'assets/data.json';

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.jsonUrl);
  }
}
