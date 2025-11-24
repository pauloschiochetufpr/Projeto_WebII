import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { catchError, of, Subscription, take } from 'rxjs';
import { ModalOrcamentoDialog } from '../modal-orcamento-dialog/modal-orcamento-dialog';
import { FuncHeader } from '../func-header/func-header';
import { DateSelection } from '../../services/date-selection';
import { SolicitacaoService } from '../../services/solicitacao';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { jwtDecode } from 'jwt-decode';

export interface Solicitation {
  idSolicitacao?: number;
  id?: number | string;
  idCliente?: number;
  requesterName?: string;
  descricao?: string;
  description?: string;
  dataHora?: string;
  createdAt?: string;
  lastUpdate?: string | null;
  idStatus?: number;
  state?: string;
  [key: string]: any;
  
}

@Component({
  selector: 'app-home-funcionario',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    FuncHeader,
    MatDialogModule,
  ],
  templateUrl: './home-funcionario.html',
  styleUrls: ['./home-funcionario.css'],
  
})
export class HomeFuncionario implements OnInit, OnDestroy {
  solicitations: Solicitation[] = [];
  loading = false;
  error: string | null = null;
  tipoUsuario?: string;
  idFuncionario?: number;


  private sub = new Subscription();

  /** Mapa fixo dos estados */
  statusMapById: Record<number, string> = {
    1: 'ABERTA',
    2: 'ORÇADA',
    3: 'REJEITADA',
    4: 'APROVADA',
    5: 'REDIRECIONADA',
    6: 'ARRUMADA',
    7: 'PAGA',
    8: 'FINALIZADA',
    9: 'CANCELADA',
  };

  constructor(
    private solicitacaoService: SolicitacaoService,
    public dateSelection: DateSelection,
    private dialog: MatDialog
  ) {}

  private extrairDadosDoToken() {
  const token = localStorage.getItem('accessToken');
  if (!token) return;

  try {
    const payload: any = jwtDecode(token);

    if (payload?.id) {
      this.idFuncionario = payload.id;   // <-- AQUI pega o id do funcionário logado
    }
    if (payload?.tipoUsuario) {
      this.tipoUsuario = payload.tipoUsuario;
    }
  } catch (e) {
    console.error('Falha ao decodificar token:', e);
  }
}

  // =====================
  // 🔹 Inicialização
  // =====================
  ngOnInit(): void {
    this.extrairDadosDoToken();   
    this.loadAbertas();
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  // =====================
  // 🔹 Busca apenas ABERTAS
  // =====================
  private loadAbertas(): void {
    this.loading = true;
    this.error = null;

    const s = this.solicitacaoService
      .listarAbertasParaFuncionario()
      .pipe(
        take(1),
        catchError((err) => {
          console.error('Erro ao buscar ABERTAS:', err);
          this.loading = false;
          this.error = 'Erro ao carregar solicitações abertas.';
          return of([]);
        })
      )
      .subscribe((arr) => {
        const list = (arr || []).map((s) => this.normalize(s));

        // ordena por data cescente
        list.sort((a, b) => {
          const da = this.parseDate(this.getDate(a))?.getTime() ?? 0;
          const db = this.parseDate(this.getDate(b))?.getTime() ?? 0;
          return da - db;
        });

        this.solicitations = list;
        this.loading = false;

        console.log('HOME-FUNCIONARIO → recebidas:', list);
      });

    this.sub.add(s);
  }

irParaOrcamento(s: Solicitation) {
  const ref = this.dialog.open(ModalOrcamentoDialog, {
    width: '400px',
    data: { solicitacao: s }
  });

  ref.afterClosed().subscribe(valor => {
    if (valor === null || valor === undefined) return; // cancelado

    // Chamada ao backend: mudar status para ORÇADA (2) + salvar valor
    this.solicitacaoService
      .atualizarStatus(s.id as number, 2, false, this.idFuncionario!)
      .subscribe({
        next: () => {
          console.log('Orçamento enviado:', valor);

          // TO-DO: atualizar o valor do orçamento via backend se necessário
          // ou criar endpoint apropriado

          this.loadAbertas(); // recarrega lista
        },
        error: (err) => {
          console.error('Erro ao enviar orçamento:', err);
        }
      });
  });
}


  // =====================
  // 🔹 Normalização
  // =====================
  private normalize(d: any): Solicitation {
    return {
      idSolicitacao: d.idSolicitacao ?? d.id,
      id: d.id ?? d.idSolicitacao,
      idCliente: d.idCliente,
      requesterName: d.cliente?.nome ?? d.requesterName ?? d.nome ?? '—',
      descricao: d.descricao ?? d.description,
      description: d.description ?? d.descricao,
      dataHora: d.dataHora ?? d.createdAt ?? d.date,
      createdAt: d.createdAt ?? d.dataHora ?? null,
      idStatus: d.idStatus,
      state: this.statusMapById[d.idStatus] ?? d.state ?? '—',
      lastUpdate: d.lastUpdate ?? d.dataHora ?? d.createdAt ?? null,
      ...d,
    };
  }

  // =====================
  // 🔹 Helpers
  // =====================
  private getDate(s: Solicitation): string | null {
    return s.lastUpdate ?? s.dataHora ?? s.createdAt ?? null;
  }

  private parseDate(str: string | null): Date | null {
    if (!str) return null;
    const d = new Date(str);
    return isNaN(d.getTime()) ? null : d;
  }

  getClientName(s: Solicitation): string {
    return s.requesterName || '—';
  }

  getDescriptionTruncated(s: Solicitation, max: number): string {
    const text = s.descricao ?? s.description ?? '—';
    return text.length > max ? text.slice(0, max - 1) + '…' : text;
  }
}
