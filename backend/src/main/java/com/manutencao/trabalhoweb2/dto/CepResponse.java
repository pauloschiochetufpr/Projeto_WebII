package com.manutencao.trabalhoweb2.dto;

public record CepResponse(
        String cep,
        String logradouro,
        String bairro,
        String localidade,
        String uf
) {}
