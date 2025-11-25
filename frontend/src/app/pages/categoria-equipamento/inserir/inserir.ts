import { Component } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CategoriaEquipamentoService } from '../../../services/categoria-equipamento';
import { CategoriaEquipamento } from '../../../models/solicitacao.model';

@Component({
  selector: 'app-inserir',
  standalone: true,
  imports: [RouterModule, FormsModule],
  templateUrl: './inserir.html',
  styleUrls: ['./inserir.css']
})
export class Inserir {
  categoria: CategoriaEquipamento = new CategoriaEquipamento();

  constructor(
    private categoriaEquipamentoService: CategoriaEquipamentoService,
    private router: Router
  ) {}

  inserir(form: NgForm): void {
    if (form.valid) {
      this.categoriaEquipamentoService.inserir(this.categoria).subscribe({
        next: () => this.router.navigate(['/categoriaEquipamento']),
        error: () => alert("Erro ao inserir categoria")
      });
    }
  }
}
