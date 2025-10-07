package com.manutencao.trabalhoweb2.dto;

public record CadastroRequest(
    String cpf,
    String nome,
    String email,
    String cep,
    Integer numero,
    String telefone
) {}