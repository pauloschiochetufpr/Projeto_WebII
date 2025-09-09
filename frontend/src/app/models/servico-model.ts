export enum StatusSolicitacao {
  ABERTA = 'Aberta',
  ORCADA = 'Orçada',
  APROVADA = 'Aprovada',
  REJEITADA = 'Rejeitada',
  REDIRECIONADA = 'Redirecionada',
  ARRUMADA = 'Arrumada',
  PAGA = 'Paga',
  FINALIZADA = 'Finalizada'
}

export interface Cliente {
  id: number;
  cpf: string;
  nome: string;
  email: string;
  telefone: string;
  endereco: Endereco;
}

// caso vc que venha ver isso tenha dúvida, o ? após significa que é opcional

export interface Endereco {
  id: number;
  cep: string;
  logradouro: string;
  numero?: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
}

export interface Funcionario {
  id: number;
  email: string;
  nome: string;
  dataNascimento: Date;
  ativo: boolean;
}

//fiz essa parte sem olhar o códigos adjacentes(do Pedro, Thiago etc), sinta-se livre para alterar caso seja necessário

export interface CategoriaEquipamento {
  id: number;
  nome: string;
  ativo: boolean;
}

export interface HistoricoSolicitacao {
  id: number;
  solicitacaoId: number;
  statusAnterior?: StatusSolicitacao;
  statusNovo: StatusSolicitacao;
  dataHora: Date;
  funcionario?: Funcionario;
  observacoes?: string;
}

export interface SolicitacaoServico {
  id: number;
  cliente: Cliente;
  descricaoEquipamento: string;
  categoria: CategoriaEquipamento;
  descricaoDefeito: string;
  status: StatusSolicitacao;
  dataAbertura: Date;
  valorOrcado?: number;
  funcionarioOrcamento?: Funcionario;
  dataOrcamento?: Date;
  motivoRejeicao?: string;
  funcionarioResponsavel?: Funcionario;
  funcionarioRedirecionado?: Funcionario;
  descricaoManutencao?: string;
  orientacoesCliente?: string;
  dataManutencao?: Date;
  dataPagamento?: Date;
  dataFinalizacao?: Date;
  funcionarioFinalizacao?: Funcionario;
  ativo: boolean;
  historico: HistoricoSolicitacao[];
}