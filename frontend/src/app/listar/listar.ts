import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RangeDatePicker } from '../range-date-picker/range-date-picker';

@Component({
  selector: 'app-listar',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RangeDatePicker],
  templateUrl: './listar.html',
  styleUrl: './listar.css',
})
export class Listar {
  filtro: 'TODAS' | 'HOJE' | 'PERIODO' = 'TODAS';
}

export enum State {
  ABERTA = 'ABERTA',
  ORCADA = 'ORÇADA',
  REJEITADA = 'REJEITADA',
  APROVADA = 'APROVADA',
  REDIRECIONADA = 'REDIRECIONADA',
  ARRUMADA = 'ARRUMADA',
  PAGA = 'PAGA',
  FINALIZADA = 'FINALIZADA',
}
