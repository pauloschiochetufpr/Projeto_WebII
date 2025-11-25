import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FuncionarioService } from '../../../services/funcionario';
import { Funcionario } from '../../../models/usuario.model';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { DatePicker } from '../../../components';
import { DateSelection } from '../../../services/date-selection';

@Component({
  selector: 'app-inserir-editar-usuario',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    DatePicker
  ],
  templateUrl: './inserir-editar-usuario.html',
  styleUrls: ['./inserir-editar-usuario.css']
})
export class InserirEditarUsuario implements OnInit {

  form!: FormGroup;
  editando = false;
  idEdicao?: number;

  constructor(
    private fb: FormBuilder,
    private service: FuncionarioService,
    private router: Router,
    private route: ActivatedRoute,
    public dateSelection: DateSelection
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      nome: ['', [Validators.required, Validators.maxLength(64)]],
      email: ['', [Validators.required, Validators.email]],
      dataNasc: ['', Validators.required],
      telefone: ['', [Validators.required, Validators.pattern(/\d{10,11}/)]],
      ativo: [true, Validators.required],
      senha: [''] // só obrigatório no cadastro
    });

    this.idEdicao = Number(this.route.snapshot.paramMap.get("id"));
    this.editando = !!this.idEdicao;

    if (this.editando) {
      this.service.buscarPorId(this.idEdicao).subscribe(func => {
        this.form.patchValue({
          nome: func.nome,
          email: func.email,
          dataNasc: func.dataNasc,
          telefone: func.telefone,
          ativo: func.ativo
        });
        this.form.controls['senha'].disable();
        this.form.controls['email'].disable();
      });
    }
  }

  salvar() {
    if (this.form.invalid) return;

    const dados = this.form.getRawValue();

    if (this.editando) {
      this.service.alterar({
        id: this.idEdicao!,
        nome: dados.nome,
        dataNasc: dados.dataNasc,
        telefone: dados.telefone,
        ativo: dados.ativo,
        email: ''
      }).subscribe(() => this.router.navigate(['/funcionarios']));
    } else {
      this.service.inserir(dados)
        .subscribe(() => this.router.navigate(['/funcionarios']));
    }
  }
}
