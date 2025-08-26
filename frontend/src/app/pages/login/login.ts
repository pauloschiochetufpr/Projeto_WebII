import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  imports: [ReactiveFormsModule, CommonModule],
})
export class LoginComponent {
  loginForm: FormGroup;
  cadastroForm: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient) {
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
    });
  }

  // --------|
  // Submits |
  // --------|

  //ainda precisa arrumar o retorno também
  onLoginSubmit() {
    if (this.loginForm.valid) {
      this.http
        .post('http://localhost:8080/api/login', this.loginForm.value, {
          responseType: 'text',
        })
        .subscribe({
          next: (res) => console.log(res),
          error: (err) => console.error(err),
        });
    }
  }

  //Mais tarde preciso arrumar o retorno
  onCadastroSubmit() {
    if (this.cadastroForm.valid) {
      const formValue = { ...this.cadastroForm.value };
      formValue.cpf = formValue.cpf.replace(/\D/g, '');
      formValue.cep = formValue.cep.replace(/\D/g, '');
      formValue.telefone = formValue.telefone.replace(/\D/g, '');

      this.http
        .post('http://localhost:8080/api/cadastro', formValue, {
          responseType: 'text',
        })
        .subscribe({
          next: (res) => console.log(res),
          error: (err) => console.error(err),
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

  // ------------------------|
  // Validação rápida de CPF |
  // ------------------------|

  cpfValidator(control: any) {
    const cpf = control.value.replace(/\D/g, '');
    if (cpf.length !== 11) return { cpfInvalido: true };

    // Inicio: Calculo do 1º dígito verificador
    let sum = 0;
    let remainder: number;

    for (let i = 1; i <= 9; i++)
      sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.substring(9, 10)))
      return { cpfInvalido: true };
    // Fim: Calculo do 1º dígito verificador
    //
    //Inicio: Calculo o 2º dígito verificador
    sum = 0;
    for (let i = 1; i <= 10; i++)
      sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.substring(10, 11)))
      return { cpfInvalido: true };
    // Fim: Calculo do 2º dígito verificador

    return null; // CPF é valido
  }
}
