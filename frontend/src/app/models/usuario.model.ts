export class Funcionario {
  constructor(
    public id?: number,
    public nome: string = "",
    public email: string = "",
    public dataNasc: string = "",
    public telefone: string = "",
    public ativo: boolean = true,
    public senha?: string  // só usado no cadastro
  ) {}
}

