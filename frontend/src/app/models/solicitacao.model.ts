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

export class Cliente {
  constructor (
    public idCliente : number, 
    public cpf: string='',
    public nome: string='',
    public email : string='',
    public telefone : string='',
    public ativo : boolean=true,
  ){}
}

export class Funcionario {
  constructor(
    public idFuncionario : number,
    public nome : string='', 
    public email : string='',
    public dataNasc : string='',
    public telefone : string='',
	  public ativo : boolean=true,
  ){}
}

