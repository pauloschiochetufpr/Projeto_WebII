import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeCliente } from '../../components/home-cliente/home-cliente';
import { HomeFuncionario } from '../../components/home-funcionario/home-funcionario';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-home',
  imports: [HomeCliente, HomeFuncionario, CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  tipoUsuario: string | undefined;
  id: number | undefined;

  ngOnInit() {
    this.extrairDadosDoToken();
  }

  private extrairDadosDoToken() {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    try {
      const payload: any = jwtDecode(token);

      if (payload?.tipoUsuario) {
        this.tipoUsuario = payload.tipoUsuario;
      }
      if (payload?.id) {
        this.id = payload.id;
      }
    } catch (e) {
      console.error('Falha ao decodificar token:', e);
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
