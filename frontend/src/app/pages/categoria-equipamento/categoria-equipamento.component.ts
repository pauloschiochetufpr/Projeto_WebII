import { Component, OnInit } from '@angular/core';
import { CategoriaEquipamentoService } from '../../services/categoria-equipamento';
import { CategoriaEquipamento } from '../../models/solicitacao.model';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-categoria-equipamento',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './categoria-equipamento.component.html',
  styleUrls: ['./categoria-equipamento.component.css']
})
export class CategoriaEquipamentoComponent implements OnInit {

  categoriasEquipamento: CategoriaEquipamento[] = [];

  constructor(private categoriaEquipamentoService: CategoriaEquipamentoService) {}

  ngOnInit(): void {
    this.carregarCategorias();
  }

  carregarCategorias(): void {
  this.categoriaEquipamentoService.listarTodos().subscribe({
    next: categorias => {
      console.log('Categorias recebidas do backend:', categorias);
      this.categoriasEquipamento = categorias;
    },
    error: err => console.error('Erro ao carregar categorias', err)
  });
}

  remover(id: number, nome: string): void {
    if (!id) {
      console.error('ID inválido para remoção');
      return;
    }

    if (confirm(`Deseja realmente remover a categoria ${nome}?`)) {
      this.categoriaEquipamentoService.remover(id).subscribe({
        next: () => {
          // Atualiza a lista sem precisar recarregar do backend
          this.categoriasEquipamento = this.categoriasEquipamento.filter(c => c.id !== id);
        },
        error: err => console.error('Erro ao remover categoria', err)
      });
    }
  }
}
