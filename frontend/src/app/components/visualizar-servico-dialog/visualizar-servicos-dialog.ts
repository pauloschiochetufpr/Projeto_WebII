import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SolicitacaoService } from '../../services/solicitacao';
import { FuncionarioService } from '../../services/funcionarioService';

export interface HistoryStep {
  state: string;
  date: string;
  by: string;
  note?: string;
}

interface Funcionario {
  id: number;
  nome: string;
}

export interface Solicitation {
  id?: number | string;
  requesterName?: string;
  description?: string;
  createdAt?: string;
  state?: string;
  redirectDestinationName?: string;
  budget?: number;
  history?: HistoryStep[];
}

@Component({
  selector: 'app-visualizar-servico-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './visualizar-servicos-dialog.html',
  styleUrls: ['./visualizar-servicos-dialog.css'],
})
export class VisualizarServicosDialog implements OnInit {
  descricaoManutencao: string = '';
  orientacoesCliente: string = '';
  orcamentoValor: number | null = null;
  orcamentoEmProcesso = false;
  orcamentoErro: string | null = null;
  funcionarios: Funcionario[] = [];
  selectedFuncionarioId: number | null = null;
  funcionariosLoading = false;
  funcionariosError: string | null = null;
  redirecionando = false;

  constructor(
    public dialogRef: MatDialogRef<VisualizarServicosDialog>,
    @Inject(MAT_DIALOG_DATA)
    public data: { user: Solicitation; currentDestination: string },
    private solicitacaoService: SolicitacaoService,
    private funcionarioService: FuncionarioService
  ) {}

  ngOnInit(): void {
    this.carregarHistorico();
  }

  // Carregar histórico de uma solicitação
  carregarHistorico(): void {
    if (!this.data.user.id) return;

    this.solicitacaoService.getHistorico(Number(this.data.user.id)).subscribe({
      next: (hist) => {
        this.data.user.history = hist.map((h) => ({
          date: h.dataHora,
          state: h.statusNew || '',
          by: h.funcionarioNew
            ? `Funcionário #${h.funcionarioNew}`
            : h.cliente
            ? 'Cliente'
            : 'Sistema',
          note: h.statusOld ? `De ${h.statusOld}` : undefined,
        }));
      },
      error: (err) => {
        console.error('Erro ao carregar histórico:', err);
        this.data.user.history = [];
      },
    });
  }

  // Efetuar Orçamento
  efetuarOrcamento() {
    this.orcamentoErro = null;

    // validação básica
    if (!this.valorValido()) {
      this.orcamentoErro = 'Digite um valor válido maior que 0';
      return;
    }

    const novoValor = Number(this.orcamentoValor);
    if (isNaN(novoValor) || novoValor <= 0) {
      this.orcamentoErro = 'Valor inválido';
      return;
    }

    const id = Number(this.data.user.id);
    if (!id) {
      this.orcamentoErro = 'ID da solicitação inválido';
      return;
    }

    this.orcamentoEmProcesso = true;

    // busca a solicitação atual para preencher campos que backend espera
    this.solicitacaoService.buscarPorId(id).subscribe({
      next: (solicitacao) => {
        const dto = {
          idSolicitacao: solicitacao.idSolicitacao ?? id,
          nome: solicitacao.nome,
          descricao: solicitacao.descricao,
          idCliente: solicitacao.idCliente,
          valor: novoValor,
          idStatus: 2, // ORÇADA
          idCategoria: solicitacao.idCategoria,
          ativo: solicitacao.ativo ?? true,
        };

        this.solicitacaoService.atualizarSolicitacao(id, dto).subscribe({
          next: (res) => {
            // atualiza UI local e fecha diálogo
            this.data.user.budget = res.valor;
            this.data.user.state = 'ORÇADA';
            this.dialogRef.close({ action: 'ORÇAR', user: this.data.user });
          },
          error: (err) => {
            console.error('Erro ao orçar:', err);
            this.orcamentoErro = err?.message || 'Erro ao enviar orçamento';
            this.orcamentoEmProcesso = false;
          },
          complete: () => {
            this.orcamentoEmProcesso = false;
          },
        });
      },
      error: (err) => {
        console.error('Erro ao buscar solicitação:', err);
        this.orcamentoErro = err?.message || 'Erro ao buscar solicitação';
        this.orcamentoEmProcesso = false;
      },
    });
  }

  // utilitária para validação do campo
  valorValido(): boolean {
    return (
      this.orcamentoValor !== null &&
      this.orcamentoValor !== undefined &&
      Number(this.orcamentoValor) > 0
    );
  }

  // limpa campo e erros
  limparOrcamento() {
    this.orcamentoValor = null;
    this.orcamentoErro = null;
  }

  // Resgatar serviço rejeitado
  resgatar() {
    this.solicitacaoService
      .atualizarStatus(Number(this.data.user.id), 3)
      .subscribe({
        next: () => {
          this.data.user.state = 'APROVADA';
          this.dialogRef.close({ action: 'RESGATAR', user: this.data.user });
        },
        error: (err) => alert('Erro ao resgatar: ' + err.message),
      });
  }

  // Efetuar Manutenção
  registrarManutencao() {
    this.solicitacaoService
      .atualizarStatus(Number(this.data.user.id), 5)
      .subscribe({
        next: () => {
          this.data.user.state = 'ARRUMADA';
          this.dialogRef.close({
            action: 'ARRUMAR',
            user: this.data.user,
            descricao: this.descricaoManutencao,
            orientacoes: this.orientacoesCliente,
          });
        },
        error: (err) => alert('Erro ao registrar manutenção: ' + err.message),
      });
  }

  carregarFuncionarios() {
    this.funcionariosLoading = true;
    this.funcionariosError = null;

    this.funcionarioService.listarTodos().subscribe({
      next: (list: Funcionario[]) => {
        this.funcionarios = list.map((f: any) => ({
          id: f.idFuncionario ?? f.id,
          nome: f.nome ?? f.nomeCompleto ?? f.name,
        }));
        this.funcionariosLoading = false;
      },
      error: (err: any) => {
        console.error('Erro ao carregar funcionários', err);
        this.funcionariosError = 'Erro ao carregar funcionários';
        this.funcionariosLoading = false;
      },
    });
  }

  // Redirecionar Manutenção
  redirecionar() {
    if (!this.selectedFuncionarioId) {
      alert('Selecione um funcionário para redirecionar.');
      return;
    }

    const idSolicitacao = Number(this.data.user.id);
    if (!idSolicitacao) {
      alert('ID da solicitação inválido.');
      return;
    }

    this.redirecionando = true;

    // chama o método do service que aceita funcionarioId (veja a mudança no service abaixo)
    this.solicitacaoService
      .atualizarStatus(idSolicitacao, 8, false, this.selectedFuncionarioId)
      .subscribe({
        next: (res) => {
          // atualiza o estado localmente
          this.data.user.state = 'REDIRECIONADA';
          // pega nome do funcionário selecionado para exibir
          const destino = this.funcionarios.find(
            (f) => f.id === this.selectedFuncionarioId
          );
          this.data.user.redirectDestinationName = destino
            ? destino.nome
            : undefined;

          this.dialogRef.close({
            action: 'REDIRECIONAR',
            user: this.data.user,
            destinoId: this.selectedFuncionarioId,
          });
        },
        error: (err) => {
          console.error('Erro ao redirecionar', err);
          alert(
            'Erro ao redirecionar: ' + (err?.message || 'Erro desconhecido')
          );
          this.redirecionando = false;
        },
        complete: () => {
          this.redirecionando = false;
        },
      });
  }

  // Pagar Serviço
  pagar() {
    this.solicitacaoService
      .atualizarStatus(Number(this.data.user.id), 6)
      .subscribe({
        next: () => {
          this.data.user.state = 'PAGA';
          this.dialogRef.close({ action: 'PAGAR', user: this.data.user });
        },
        error: (err) => alert('Erro ao pagar: ' + err.message),
      });
  }

  // Finalizar Solicitação
  finalizar() {
    this.solicitacaoService
      .atualizarStatus(Number(this.data.user.id), 7)
      .subscribe({
        next: () => {
          this.data.user.state = 'FINALIZADA';
          this.dialogRef.close({ action: 'FINALIZAR', user: this.data.user });
        },
        error: (err) => alert('Erro ao finalizar: ' + err.message),
      });
  }

  close() {
    this.dialogRef.close();
  }
  // Redirecionar para si mesmo
  redirecionarParaMim() {
    const destino = this.data.currentDestination;
    this.solicitacaoService
      .atualizarStatus(Number(this.data.user.id), 8)
      .subscribe({
        next: () => {
          this.data.user.state = 'REDIRECIONADA';
          this.data.user.redirectDestinationName = destino;
          this.dialogRef.close({
            action: 'REDIRECIONAR',
            user: this.data.user,
            destino,
          });
        },
        error: (err) =>
          alert('Erro ao redirecionar para si mesmo: ' + err.message),
      });
  }

  get diasDesdeAbertura(): number | null {
    if (!this.data?.user?.createdAt) return null;
    const created = new Date(this.data.user.createdAt);
    if (isNaN(created.getTime())) return null;

    const diffMs = Date.now() - created.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  trackHistory(index: number, item: any) {
    return item.id || index;
  }
}
