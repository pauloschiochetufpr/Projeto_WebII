package com.manutencao.trabalhoweb2.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record SolicitacaoResponseDto(
        Long idSolicitacao,
        String nome,
        String descricao,
        Long idCliente,
        BigDecimal valor,
        Integer idStatus,
        Integer idCategoria,
        Boolean ativo,
        LocalDateTime createdAt
) {}
