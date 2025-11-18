import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth';
import {
  debounceTime,
  distinctUntilChanged,
  switchMap,
  filter,
  takeWhile,
  startWith,
} from 'rxjs/operators';
import { interval, of } from 'rxjs';
import { LucideAngularModule } from 'lucide-angular';
import { NotificationComponent } from '../../components';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.html',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    LucideAngularModule,
    NotificationComponent,
  ],
})
export class LoginComponent {
  loginForm: FormGroup;
  cadastroForm: FormGroup;
  isSubmittingCadastro = false;
  isSubmittingLogin = false;
  emailValidoLogin: boolean | null = null;
  emailValidoCadastro: boolean | null = null;
  telefoneValidoCadastro: boolean | null = null;
  isBuscandoCep = false;

  isHoveringLogin = false;
  isHoveringCadastro = false;
  zAtivo = false;
  private fadeInTimer?: ReturnType<typeof setTimeout>;
  private fadeOutTimer?: ReturnType<typeof setTimeout>;

  mensagemNotificacaoLogin: string | null = null;
  codigoNotificacaoLogin?: number;

  mensagemNotificacaoCadastro: string | null = null;
  codigoNotificacaoCadastro?: number;

  get mostrarAlerta(): boolean {
    const inativo = !this.isHoveringLogin && !this.isHoveringCadastro;

    // Limpamos timers antigos para evitar conflito entre estados
    clearTimeout(this.fadeInTimer);
    clearTimeout(this.fadeOutTimer);

    if (inativo) {
      // Quando hover sai → queremos que o fade-in ocorra suavemente
      // Esperamos um pequeno delay para deixar o Tailwind começar o fade antes de ajustar o z-index
      this.fadeInTimer = setTimeout(() => {
        this.zAtivo = true;
      }, 1); // levemente atrasado para sincronizar com o início da animação
    } else {
      // Quando hover volta → aguardamos o fade-out terminar antes de remover o z-index
      this.fadeOutTimer = setTimeout(() => {
        this.zAtivo = false;
      }, 350); // ligeiramente acima do duration-300 do Tailwind
    }

    return inativo;
  }

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    // Login //
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [Validators.required, Validators.minLength(4), Validators.maxLength(4)],
      ],
    });

    // Cadastro //
    this.cadastroForm = this.fb.group({
      cpf: ['', [Validators.required, this.cpfValidator]],
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      cep: ['', Validators.required],
      telefone: ['', Validators.required],
      logradouro: ['', Validators.required],
      bairro: ['', Validators.required],
      localidade: ['', Validators.required],
      uf: ['', Validators.required],

      numero: ['', Validators.required],
      complemento: ['', Validators.required],
    });

    this.loginForm
      .get('email')
      ?.valueChanges.pipe(
        debounceTime(1000),
        distinctUntilChanged(),
        filter(
          (email: string) =>
            !!email && email.includes('@') && email.split('@')[1].length > 0
        ),
        switchMap((email: string) =>
          this.authService.validarEmail(email.trim())
        )
      )
      .subscribe((valido) => (this.emailValidoLogin = valido));

    this.cadastroForm
      .get('email')
      ?.valueChanges.pipe(
        debounceTime(3000),
        distinctUntilChanged(),
        filter((email: string) => !!email && email.includes('@')),
        switchMap((email: string) => this.authService.validarEmail(email))
      )
      .subscribe((valido) => (this.emailValidoCadastro = valido));

    this.cadastroForm
      .get('telefone')
      ?.valueChanges.pipe(
        debounceTime(2000),
        distinctUntilChanged(),
        switchMap((telefone: string) => {
          const numeros = telefone.replace(/\D/g, '');
          if (!numeros || numeros.length < 10) return [null]; // não verifica ainda
          return this.authService.validarTelefone(numeros); // chama o backend
        })
      )
      .subscribe((valido) => (this.telefoneValidoCadastro = valido));

    this.cadastroForm
      .get('cep')
      ?.valueChanges.pipe(
        distinctUntilChanged(),
        filter((cep: string) => !!cep && cep.replace(/\D/g, '').length === 8),
        switchMap((cep: string) => {
          const numeros = cep.replace(/\D/g, '');
          this.isBuscandoCep = true;
          let tentativas = 0;

          return interval(120000).pipe(
            // polling a cada 2 minutos
            startWith(0),
            switchMap(() => {
              tentativas++;
              return this.authService.validarCep(numeros);
            }),

            takeWhile((dados) => !dados && tentativas < 10, true)
          );
        })
      )
      .subscribe((dados) => {
        if (dados) {
          this.cadastroForm.patchValue({
            logradouro: dados.logradouro || '',
            bairro: dados.bairro || '',
            localidade: dados.localidade || '',
            uf: dados.uf || '',
          });
          this.isBuscandoCep = false;
        } else {
          this.isBuscandoCep = true;
        }
      });
  }

  // --------|
  // Submits |
  // --------|

  onLoginSubmit() {
    if (
      this.loginForm.valid &&
      this.emailValidoLogin &&
      !this.isSubmittingLogin
    ) {
      this.isSubmittingLogin = true;
      const { email, password } = this.loginForm.value;

      this.authService.login(email, password).subscribe({
        next: (res) => {
          this.isSubmittingLogin = false;

          // Verifica AuthResponse
          if ('accessToken' in res && res.accessToken) {
            console.log('Tokens recebidos');
            this.router.navigate(['/']);
            // Authservice já redireciona e faz tudo necessário
          }

          // Verifica BasicResponse
          else if ('code' in res && 'message' in res) {
            this.mensagemNotificacaoLogin = res.message;
            this.codigoNotificacaoLogin = res.code;
            setTimeout(() => {
              this.mensagemNotificacaoLogin = null;
              this.codigoNotificacaoLogin = undefined;
            }, 5000);
          }

          // Caso inesperado
          else {
            this.mensagemNotificacaoLogin = 'Resposta inesperada do servidor.';
            this.codigoNotificacaoLogin = 500;
          }
        },
        error: (err) => {
          console.error('Erro login:', err);
          this.isSubmittingLogin = false;

          this.mensagemNotificacaoLogin =
            err?.error?.message || 'Erro inesperado no login.';
          this.codigoNotificacaoLogin = err?.status || 500;

          setTimeout(() => {
            this.mensagemNotificacaoLogin = null;
            this.codigoNotificacaoLogin = undefined;
          }, 5000);
        },
      });
    }
  }

  onCadastroSubmit() {
    if (
      this.cadastroForm.valid &&
      !this.isSubmittingCadastro &&
      this.emailValidoCadastro
    ) {
      this.isSubmittingCadastro = true;

      const formValue = { ...this.cadastroForm.value };
      formValue.cpf = formValue.cpf.replace(/\D/g, '');
      formValue.cep = formValue.cep.replace(/\D/g, '');
      formValue.telefone = formValue.telefone.replace(/\D/g, '');

      this.authService.cadastro(formValue).subscribe({
        next: (res) => {
          this.mensagemNotificacaoCadastro = res.message;
          this.codigoNotificacaoCadastro = res.code;

          if (res.code === 200) {
            this.cadastroForm.reset();
          }

          setTimeout(() => {
            this.mensagemNotificacaoCadastro = null;
            this.codigoNotificacaoCadastro = undefined;
          }, 5000);

          this.isSubmittingCadastro = false;
        },
        error: (err) => {
          this.mensagemNotificacaoCadastro =
            err?.error?.message || 'Erro inesperado no cadastro.';
          this.codigoNotificacaoCadastro = err?.status || 500;

          setTimeout(() => {
            this.mensagemNotificacaoCadastro = null;
            this.codigoNotificacaoCadastro = undefined;
          }, 5000);

          this.isSubmittingCadastro = false;
        },
      });
    }
  }

  // ---------|
  // Máscaras |
  // ---------|

  applyCpfMask() {
    let v = this.cadastroForm.value.cpf.replace(/\D/g, '');
    if (v.length > 11) v = v.slice(0, 11);
    v = v.replace(/(\d{3})(\d)/, '$1.$2');
    v = v.replace(/(\d{3})(\d)/, '$1.$2');
    v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    this.cadastroForm.patchValue({ cpf: v }, { emitEvent: false });
  }

  applyCepMask() {
    let v = this.cadastroForm.value.cep.replace(/\D/g, '');
    if (v.length > 8) v = v.slice(0, 8);
    v = v.replace(/(\d{5})(\d)/, '$1-$2');
    this.cadastroForm.patchValue({ cep: v }, { emitEvent: false });
  }

  applyPhoneMask() {
    let v = this.cadastroForm.value.telefone.replace(/\D/g, '');
    if (v.length > 11) v = v.slice(0, 11);
    v = v.replace(/^(\d{2})(\d)/, '($1) $2');
    v = v.replace(/(\d{5})(\d)/, '$1-$2');
    this.cadastroForm.patchValue({ telefone: v }, { emitEvent: false });
  }

  applyNumeroMask() {
    let v = this.cadastroForm.value.numero.replace(/\D/g, ''); // remove tudo que não for número
    this.cadastroForm.patchValue({ numero: v }, { emitEvent: false });
  }

  // ------------------------|
  // Validação rápida de CPF |
  // ------------------------|

  cpfValidator(control: any) {
    const cpf = control.value.replace(/\D/g, '');
    if (cpf.length !== 11) return { cpfInvalido: true };

    let sum = 0;
    let remainder: number;

    for (let i = 1; i <= 9; i++)
      sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.substring(9, 10)))
      return { cpfInvalido: true };

    sum = 0;
    for (let i = 1; i <= 10; i++)
      sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.substring(10, 11)))
      return { cpfInvalido: true };

    return null;
  }
}
