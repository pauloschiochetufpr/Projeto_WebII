package com.manutencao.trabalhoweb2.dto;

import java.math.BigDecimal;

public record CreateSolicitacaoRequest(
    String nome,
    String descricao,
    Long clienteId,         // nullable
    BigDecimal valor,
    Integer idStatus,
    Integer idCategoria
) {}
