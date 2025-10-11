package com.manutencao.trabalhoweb2.dto;

public record HistSolicitacaoDto(
    Long idHistorico,
    String dataHora,
    Long idSolicitacao,
    Boolean cliente,
    String statusOld,
    String statusNew,
    Long funcionarioOld,
    Long funcionarioNew
) {}
