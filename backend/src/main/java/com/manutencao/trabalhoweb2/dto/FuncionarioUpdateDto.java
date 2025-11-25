package com.manutencao.trabalhoweb2.dto;

import java.time.LocalDate;
import jakarta.validation.constraints.*;

public record FuncionarioUpdateDto(
    @NotBlank(message = "Nome é obrigatório")
    @Size(max = 64)
    String nome,

    @NotNull(message = "Data de nascimento é obrigatória")
    @Past
    LocalDate dataNasc,

    @NotBlank(message = "Telefone é obrigatório")
    @Pattern(regexp = "\\d{10,11}", message = "Telefone inválido. Use 10 ou 11 números (DDD + número)")
    String telefone,

    @NotNull(message = "Campo ativo é obrigatório")
    Boolean ativo
) {}
