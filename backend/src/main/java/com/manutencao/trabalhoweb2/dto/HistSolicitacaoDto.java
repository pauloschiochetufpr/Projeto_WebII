package com.manutencao.trabalhoweb2.dto;

import java.time.LocalDateTime;

public record HistSolicitacaoDto(
        Long id,
        Long solicitacaoId,
        Boolean cliente,
        String statusOld,
        String statusNew,
        Integer funcionarioOld,
        Integer funcionarioNew,
        LocalDateTime dataHora,
        String motivo
) {}
