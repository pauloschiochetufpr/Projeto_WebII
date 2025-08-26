import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder } from '@angular/forms';
// import adicionado para implementar a classe http
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-listar',
  templateUrl: './listar.html',
  styleUrl: './listar.css',
})
export class Listar {
    
  filtro: 'TODAS' | 'HOJE' | 'PERIODO' = 'TODAS';
  form: FormGroup;
  //temporário enquanto não temos um login completamente funcional. Tá aqui so para os testes
  currentUser = { id: 'EMP1', name: 'Técnico João' };
  solicitacoes: Solicitacao[] = [];
  listaFiltrada: Solicitacao[] = [];

  // Constructor inicializa o form com dois controladores. 
  // Serve pra garantir que quando a página for aberta já existam dados. Tambem e temporario sem a tela de login
  constructor(private fb: FormBuilder, private http: HttpClient) {
    
    this.form = this.fb.group({
      dateFrom: [null],
      dateTo: [null],
    });

    //carrega as solicitações do JSON
    this.loadFromJson();
  }

//Método para carregar solicitacoes do arquivo .json
  private loadFromJson(): void {
    // por enquanto as solicitacoes ficaram juntos da listagem so pros testes
    this.http.get<Solicitacao[]>('listar/solicitacoes.json').subscribe({
      next: (data) => {
        this.solicitacoes = Array.isArray(data) ? data : [];
        this.aplicarFiltro();
      },
      error: (err) => {
        console.error('Erro ao carregar solicitacoes.json', err);
        this.solicitacoes = [];
        this.aplicarFiltro();
      }
    });
  }

  // filtragem pro botão de atualizar
  aplicarFiltro(): void {
    let lista = [...this.solicitacoes];

    lista = lista.filter(s => {
      if (s.redirected) {
        return s.redirectDestinationId === this.currentUser.id;
      }
      return true;
    });

    
    if (this.filtro === 'HOJE') {
      //cálculo entre início e fim de dia, filtrando por createdAt (ano, mes, dia e hora que ela foi emitida)
      const now = new Date();
      const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const end = new Date(start.getTime() + 24 * 3600 * 1000 - 1);
      lista = lista.filter(s => {
        const d = new Date(s.createdAt);
        return d >= start && d <= end;
      });
    }

 
    if (this.filtro === 'PERIODO') {
      // usa this.form.value.dateFrom e dateTo para filtrar por período
      const from: Date | null = this.form.value.dateFrom;
      const to: Date | null = this.form.value.dateTo;
      if (from) {
        const start = new Date(from);
        start.setHours(0,0,0,0);
        lista = lista.filter(s => new Date(s.createdAt) >= start);
      }
      if (to) {
        const end = new Date(to);
        end.setHours(23,59,59,999);
        lista = lista.filter(s => new Date(s.createdAt) <= end);
      }
    }

    // ordena asc por createdAt
    lista.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

    this.listaFiltrada = lista;
  }

  // utilitários:
  private stripDiacritics(text: string): string {
    if (!text) return '';
    return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '');
  }

  getBadgeClass(s: Solicitacao): string {
    const stateKey = this.stripDiacritics(s.state).toUpperCase();
    return `badge badge--${stateKey}`;
  }
}

// interface para tipagem de solicita~~ao
interface Solicitacao {
  id: string;
  requesterId?: string;
  requesterName?: string;
  description: string;
  state: string;
  createdAt: string;
  redirected?: boolean;
  redirectDestinationId?: string;
  redirectDestinationName?: string;
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