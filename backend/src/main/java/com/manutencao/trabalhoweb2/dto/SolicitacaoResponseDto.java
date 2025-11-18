package com.manutencao.trabalhoweb2.dto;
import java.math.BigDecimal;

public record SolicitacaoResponseDto(
        Long idSolicitacao,
        String nome,
        String descricao,
        BigDecimal valor,
        Integer idStatus,
        Integer idCategoria,
        Boolean ativo,
        Long idCliente,
        String nomeCliente
) {}



