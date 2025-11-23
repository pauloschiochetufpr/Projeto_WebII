package com.manutencao.trabalhoweb2.mapper;

import org.springframework.stereotype.Component;

import com.manutencao.trabalhoweb2.dto.HistSolicitacaoDto;
import com.manutencao.trabalhoweb2.model.HistSolicitacao;

@Component
public class HistSolicitacaoMapper {

    public HistSolicitacaoDto toDto(HistSolicitacao h) {
        return new HistSolicitacaoDto(
                h.getIdHistorico(),
                h.getSolicitacao() != null ? h.getSolicitacao().getIdSolicitacao() : null,
                h.getCliente(),
                h.getStatusOld(),
                h.getStatusNew(),
                h.getFuncionarioOld(),
                h.getFuncionarioNew(),
                h.getDataHora(),
                h.getMotivo()
        );
    }
}
