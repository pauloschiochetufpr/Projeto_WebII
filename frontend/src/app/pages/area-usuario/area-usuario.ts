import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { NotificationComponent } from '../../components';
import { jwtDecode } from 'jwt-decode';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { AreaUsuarioService } from '../../services/areaUsuarioService';

@Component({
  selector: 'area-usuario',
  standalone: true,
  templateUrl: './area-usuario.html',
  imports: [
    CommonModule,
    LucideAngularModule,
    ReactiveFormsModule,
    NotificationComponent,
  ],
})
export class AreaUsuario {
  paginaAtual: string = 'Perfil';

  credenciaisForm: FormGroup;

  nomeUsuario: string | null = null;

  codigoResposta: number | null = null;
  mensagemResposta: string | null = null;

  constructor(
    private fb: FormBuilder,
    private areaUsuarioService: AreaUsuarioService
  ) {
    this.extrairNomeDoToken();

    this.credenciaisForm = this.fb.group({
      email: ['', [Validators.email, Validators.maxLength(150)]],
      senha: ['', [Validators.pattern('^[0-9]{4}$')]],
    });
  }

  selecionar(pagina: string) {
    this.paginaAtual = pagina;
  }

  enviarFormulario() {
    if (!this.credenciaisForm.valid) {
      this.codigoResposta = 400;
      this.mensagemResposta = 'Dados inválidos no formulário.';
      return;
    }

    const token = localStorage.getItem('accessToken');

    if (!token) {
      this.codigoResposta = 401;
      this.mensagemResposta = 'Token não encontrado.';
      return;
    }

    const dados = {
      email: this.credenciaisForm.value.email || null,
      senha: this.credenciaisForm.value.senha || null,
      token: token,
    };

    this.areaUsuarioService.alterarCredenciais(dados).subscribe({
      next: (res) => {
        this.codigoResposta = res.code;
        this.mensagemResposta = res.message;

        setTimeout(() => {
          this.codigoResposta = null;
          this.mensagemResposta = null;
        }, 3000);
      },
      error: (err) => {
        this.codigoResposta = err.status ?? 500;
        this.mensagemResposta = 'Erro ao enviar dados.';

        setTimeout(() => {
          this.codigoResposta = null;
          this.mensagemResposta = null;
        }, 3000);
      },
    });
  }

  extrairNomeDoToken() {
    const token = localStorage.getItem('accessToken');

    if (!token) return;

    try {
      const payload: any = jwtDecode(token);
      this.nomeUsuario = payload.nome || null;
    } catch (e) {
      console.error('Erro ao decodificar token:', e);
    }
  }
}
