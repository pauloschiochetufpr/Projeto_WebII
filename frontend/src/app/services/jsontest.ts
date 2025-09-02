import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
  name: string;
  date: string;
}

@Injectable({
  providedIn: 'root'
})
export class JsonTestService {
  private jsonUrl = 'assets/data.json';

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.jsonUrl);
  }
}
