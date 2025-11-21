import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { funcionario } from '../models/usuario.model'; 
import { Login } from '../models/login.model';

const LS_CHAVE: string = 'funcionarioLogado'

@Injectable({
  providedIn: 'root'
})
export class Login {
  
}
