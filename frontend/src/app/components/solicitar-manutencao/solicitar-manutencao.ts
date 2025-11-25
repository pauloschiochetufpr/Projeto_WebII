import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';

import { SolicitacaoService } from '../../services/solicitacao';

@Component({
  selector: 'app-solicitar-manutencao',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './solicitar-manutencao.html',
})
export class SolicitarManutencaoComponent implements OnInit, OnDestroy {
  formData: any = {
    descricaoEquipamento: '',
    categoriaEquipamento: null,
    descricaoDefeito: '',
  };

  categorias: any[] = [];
  loading = false;
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
    const s = this.solicitacaoService.getCategorias().subscribe({
      next: (cats) => {
        console.log('[Component] Categorias recebidas do service:', cats);

        // Corrige para que cada categoria tenha a propriedade `id` que o select espera
        this.categorias = cats.map((c: any) => ({
          id: c.idCategoria, // <- aqui estava o problema
          nome: c.nome,
          ativo: c.ativo,
        }));

        // Log para confirmar
        this.categorias.forEach((c: any, i: number) => {
          console.log(
            `[Component] Categoria[${i}] id:`,
            c.id,
            'tipo:',
            typeof c.id
          );
        });
      },
      error: (err) =>
        console.error('[Component] Erro ao carregar categorias', err),
    });
    this.sub.add(s);
  }

  onSubmit(): void {
    console.log('[Component] onSubmit chamado', this.formData);

    if (
      !this.formData.descricaoEquipamento.trim() ||
      this.formData.categoriaEquipamento == null ||
      !this.formData.descricaoDefeito.trim()
    ) {
      this.error = 'Preencha todos os campos obrigatórios.';
      console.warn('[Component] Form inválido:', this.formData);
      return;
    }

    this.loading = true;
    console.log('[Component] Form válido. Chamando service...');

    const s = this.solicitacaoService
      .criarSolicitacao(this.formData)
      .subscribe({
        next: (res) => {
          console.log('[Component] Solicitação enviada com sucesso:', res);
          this.success = 'Solicitação enviada com sucesso!';
          this.loading = false;

          setTimeout(() => {
            console.log('[Component] Redirecionando para /');
            this.router.navigate(['/']);
          }, 2000);
        },
        error: (err) => {
          console.error('[Component] Erro ao enviar solicitação:', err);
          this.error = 'Erro ao enviar solicitação.';
          this.loading = false;
        },
      });

    this.sub.add(s);
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}
