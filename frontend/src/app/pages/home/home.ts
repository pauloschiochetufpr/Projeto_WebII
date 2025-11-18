import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeCliente } from '../../components/home-cliente/home-cliente';
import { HomeFuncionario } from '../../components/home-funcionario/home-funcionario';

@Component({
  selector: 'app-home',
  imports: [HomeCliente, HomeFuncionario, CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  tipoUsuario: string | undefined;

  ngOnInit() {
    const token = localStorage.getItem('accessToken');

    // Verifique se o token existe antes de chamar a função
    if (token) {
      const payload = getTokenPayload(token); // Remova o '!'
      this.tipoUsuario = payload?.tipoUsuario;
      console.log('Tipo de usuário (Decodificado):', this.tipoUsuario);
    } else {
      // Log para saber que o token está faltando
      console.warn('⚠️ Token não encontrado. tipoUsuario é undefined.');
      this.tipoUsuario = undefined;
    }
  }
}

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
