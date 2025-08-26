package com.manutencao.trabalhoweb2.dto;

public class CadastroRequest {

    private String cpf;
    private String nome;
    private String email;
    private String cep;
    private String telefone;

    public CadastroRequest() {}

    // Getter e Setter abaixo (controle de dados, adoro isso ;) )
    public String getCpf() { return cpf; }
    public void setCpf(String cpf) { this.cpf = cpf; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getCep() { return cep; }
    public void setCep(String cep) { this.cep = cep; }

    public String getTelefone() { return telefone; }
    public void setTelefone(String telefone) { this.telefone = telefone; }
}
