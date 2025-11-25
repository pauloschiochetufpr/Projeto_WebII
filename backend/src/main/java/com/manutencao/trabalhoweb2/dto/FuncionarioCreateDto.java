package com.manutencao.trabalhoweb2.dto;

import java.time.LocalDate;
import jakarta.validation.constraints.*;

public record FuncionarioCreateDto(
    @NotBlank(message = "Nome é obrigatório")
    @Size(max = 64, message = "Nome deve ter no máximo 64 caracteres")
    String nome,

    @NotBlank(message = "Email é obrigatório")
    @Email(message = "Email inválido")
    @Size(max = 128, message = "Email deve ter no máximo 128 caracteres")
    String email,

    @NotNull(message = "Data de nascimento é obrigatória")
    @Past(message = "Data de nascimento deve ser anterior a hoje")
    LocalDate dataNasc,

    @NotBlank(message = "Telefone é obrigatório")
    @Pattern(regexp = "\\d{10,11}", message = "Telefone inválido. Use 10 ou 11 números (DDD + número)")
    String telefone,

    @NotBlank(message = "Senha é obrigatória")
    @Pattern(regexp = "\\d{4}", message = "Senha deve ter exatamente 4 dígitos numéricos")
    String senha
) {}
