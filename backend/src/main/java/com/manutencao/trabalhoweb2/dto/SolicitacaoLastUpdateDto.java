package com.manutencao.trabalhoweb2.dto;

import java.math.BigDecimal;

public record SolicitacaoLastUpdateDto(
        Long idSolicitacao,
        String nome,
        String descricao,
        Long idCliente,
        BigDecimal valor,
        Integer idStatus,
        Integer idCategoria,
        Boolean ativo,
        String lastUpdate,
        String createdAt,
        String nomeCliente,
        String statusOld,
        String statusNew,
        Long funcionarioOld,
        Long funcionarioNew
) {}
