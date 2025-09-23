import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { SolicitacaoService } from '../../services/solicitacao';
import { SolicitacaoCreateDto, CategoriaEquipamento } from '../../models/solicitacao.model'

@Component({
  selector: 'app-solicitar-manutencao',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './solicitar-manutencao.component.html'
})
export class SolicitarManutencaoComponent implements OnInit, OnDestroy {
  
  formData: SolicitacaoCreateDto = {
    descricaoEquipamento: '',
    categoriaEquipamento: '',
    descricaoDefeito: ''
  };

  categorias: CategoriaEquipamento[] = [];
  loading = false;
  loadingCategorias = false;
  error: string | null = null;
  success: string | null = null;

  private sub = new Subscription();

  constructor(
    private solicitacaoService: SolicitacaoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCategorias();
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  private loadCategorias(): void {
    this.loadingCategorias = true;
    const s = this.solicitacaoService.getCategorias().subscribe({
      next: (categorias) => {
        this.categorias = categorias;
        this.loadingCategorias = false;
      },
      error: (err) => {
        console.error('Erro ao carregar categorias', err);
        this.loadingCategorias = false;
        // Fallback
        this.categorias = [
          { id: 1, nome: 'Notebook', ativo: true },
          { id: 2, nome: 'Desktop', ativo: true },
          { id: 3, nome: 'Impressora', ativo: true },
          { id: 4, nome: 'Mouse', ativo: true },
          { id: 5, nome: 'Teclado', ativo: true }
        ];
      }
    });
    this.sub.add(s);
  }

  onSubmit(): void {
    if (!this.validarForm()) {
      return;
    }

    this.loading = true;
    this.error = null;
    this.success = null;

    const s = this.solicitacaoService.criarSolicitacao(this.formData).subscribe({
      next: (response) => {
        this.success = 'Solicitação enviada com sucesso!';
        this.loading = false;
        
        // Limpar formulário após 2 segundos e redirecionar
        setTimeout(() => {
          this.resetForm();
          this.router.navigate(['/cliente/home']);
        }, 2000);
      },
      error: (err) => {
        console.error('Erro ao enviar solicitação', err);
        this.error = 'Erro ao enviar solicitação. Tente novamente.';
        this.loading = false;
      }
    });
    this.sub.add(s);
  }

  private validarForm(): boolean {
    if (!this.formData.descricaoEquipamento?.trim()) {
      this.error = 'Descrição do equipamento é obrigatória';
      return false;
    }
    if (this.formData.descricaoEquipamento.length < 5) {
      this.error = 'Descrição do equipamento deve ter pelo menos 5 caracteres';
      return false;
    }
    if (!this.formData.categoriaEquipamento) {
      this.error = 'Selecione uma categoria';
      return false;
    }
    if (!this.formData.descricaoDefeito?.trim()) {
      this.error = 'Descrição do defeito é obrigatória';
      return false;
    }
    if (this.formData.descricaoDefeito.length < 10) {
      this.error = 'Descrição do defeito deve ter pelo menos 10 caracteres';
      return false;
    }
    return true;
  }
 //
  private resetForm(): void {
    this.formData = {
      descricaoEquipamento: '',
      categoriaEquipamento: '',
      descricaoDefeito: ''
    };
    this.error = null;
    this.success = null;
  }
  //voltar p inicio
  goBack(): void {
    this.router.navigate(['/cliente/home']);
  }
}
