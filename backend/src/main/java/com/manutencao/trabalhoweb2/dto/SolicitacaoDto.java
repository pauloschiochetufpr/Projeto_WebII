package com.manutencao.trabalhoweb2.dto;

import java.math.BigDecimal;

public record SolicitacaoDto(
    Long idSolicitacao,
    String nome,
    String descricao,
    Long idCliente,
    BigDecimal valor,
    Integer idStatus,
    Integer idCategoria,
    Boolean ativo
) {}
