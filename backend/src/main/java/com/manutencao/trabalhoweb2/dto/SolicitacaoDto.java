package com.manutencao.trabalhoweb2.dto;

public record SolicitacaoDto(
    Long idSolicitacao,
    String nome,
    String descricao,
    Long idCliente,
    Double valor,
    Integer idStatus,
    Integer idCategoria,
    Boolean ativo
) {}
