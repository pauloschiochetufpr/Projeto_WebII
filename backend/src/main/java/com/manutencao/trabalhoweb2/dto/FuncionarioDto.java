package com.manutencao.trabalhoweb2.dto;

import java.time.LocalDate;

public record FuncionarioDto(
    Long id,
    String nome,
    String email,
    LocalDate dataNasc,
    String telefone,
    Boolean ativo
) {}
