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
} from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  imports: [ReactiveFormsModule, CommonModule],
})
export class LoginComponent {
  loginForm: FormGroup;
  cadastroForm: FormGroup;
  isSubmittingCadastro = false;
  isSubmittingLogin = false;
  emailValidoLogin: boolean | null = null;
  emailValidoCadastro: boolean | null = null;
  telefoneValidoCadastro: boolean | null = null;

  constructor(private fb: FormBuilder, private authService: AuthService) {
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
      logradouro: [{ value: '', disabled: true }],
      bairro: [{ value: '', disabled: true }],
      cidade: [{ value: '', disabled: true }],
      uf: [{ value: '', disabled: true }],
      numero: [''],
    });

    this.loginForm
      .get('email')
      ?.valueChanges.pipe(
        debounceTime(3000),
        distinctUntilChanged(),
        filter((email: string) => !!email && email.includes('@')),
        switchMap((email: string) => this.authService.validarEmail(email))
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
        debounceTime(1500),
        distinctUntilChanged(),
        filter((cep: string) => !!cep && cep.replace(/\D/g, '').length === 8),
        switchMap((cep: string) =>
          this.authService.validarCep(cep.replace(/\D/g, ''))
        )
      )
      .subscribe((dados) => {
        if (dados) {
          this.cadastroForm.patchValue({
            logradouro: dados.logradouro || '',
            bairro: dados.bairro || '',
            cidade: dados.localidade || '',
            uf: dados.uf || '',
          });
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
          console.log('Login OK:', res);
          this.isSubmittingLogin = false;
        },
        error: (err) => {
          console.error('Erro login:', err);
          this.isSubmittingLogin = false;
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
          console.log('Cadastro OK:', res);
          this.isSubmittingCadastro = false; // libera botão
        },
        error: (err) => {
          console.error('Erro cadastro:', err);
          this.isSubmittingCadastro = false; // libera botão
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
    let v = this.cadastroForm.value.numero.replace(/\D/g, '');
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
