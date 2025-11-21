export class Funcionario {
    constructor(
    public id_funcionario: number = 0,
    public nome: string = "",
    public email: string = "",
    public data_nasc: string = "",
    public telefone: string = "",
    public senha_hash:  string = "",
    public ativo: boolean = true,
    public perfil: string = ""
    ) {}
}

