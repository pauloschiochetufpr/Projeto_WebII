import { Component, OnInit } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CategoriaEquipamentoService } from '../../../services/categoria-equipamento';
import { CategoriaEquipamento } from '../../../models/solicitacao.model';

@Component({
  selector: 'app-editar-categoria',
  standalone: true,
  imports: [RouterModule, FormsModule],
  templateUrl: './editar-categoria.html',
  styleUrls: ['./editar-categoria.css']
})
export class EditarCategoria implements OnInit {
  categoria: CategoriaEquipamento = new CategoriaEquipamento();

  constructor(
    private categoriaEquipamentoService: CategoriaEquipamentoService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = +this.route.snapshot.params['id'];
    this.categoriaEquipamentoService.buscarPorId(id).subscribe({
      next: (categoria) => this.categoria = categoria,
      error: () => {
        alert("Categoria não encontrada");
        this.router.navigate(['/categoriaEquipamento']);
      }
    });
  }

  atualizar(form: NgForm): void {
    if (form.valid) {
      this.categoriaEquipamentoService.atualizar(this.categoria).subscribe({
        next: () => this.router.navigate(['/categoriaEquipamento']),
        error: () => alert("Erro ao atualizar categoria")
      });
    }
  }
}
