export interface SolicitacaoCreateDto {
  descricaoEquipamento: string;
  categoriaEquipamento: string;
  descricaoDefeito: string;
}

export interface Solicitation {
  idSolicitacao?: number;
  id?: number | string;
  idCliente?: number;
  descricaoEquipamento?: string;
  categoriaEquipamento?: string;
  descricaoDefeito?: string;
  dataHora?: string;
  idStatus?: number;
  state?: string;
  valor?: number;
  [key: string]: any;
}


export class CategoriaEquipamento {
  constructor(
    public id: number = 0,
    public nome: string = '',
    public ativo: boolean = true
  ) {}
}
