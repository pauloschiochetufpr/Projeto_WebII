import { Component } from '@angular/core';
import { HomeCliente } from '../../components/home-cliente/home-cliente';

@Component({
  selector: 'app-home',
  imports: [HomeCliente],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {}

function getTokenPayload(token: string): any | null {
  try {
    const payloadPart = token.split('.')[1];
    const base64 = payloadPart.replace(/-/g, '+').replace(/_/g, '/');
    const decoded = atob(base64);
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}
const token = localStorage.getItem('token');
const payload = getTokenPayload(token!);
const tipoUsuario = payload?.tipoUsuario;
console.log('Tipo de usuário:', tipoUsuario);
