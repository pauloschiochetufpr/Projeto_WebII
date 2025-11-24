package com.manutencao.trabalhoweb2.mapper;

import org.springframework.stereotype.Component;

import com.manutencao.trabalhoweb2.dto.SolicitacaoResponseDto;
import com.manutencao.trabalhoweb2.model.Solicitacao;

@Component
public class SolicitacaoMapper {

    public SolicitacaoResponseDto toDto(Solicitacao s) {
        if (s == null) return null;

        return new SolicitacaoResponseDto(
                s.getIdSolicitacao(),
                s.getNome(),
                s.getDescricao(),
                s.getCliente() != null ? s.getCliente().getIdCliente() : null,
                s.getValor(),
                s.getIdStatus(),
                s.getIdCategoria(),
                s.getAtivo(),
                s.getCreatedAt()
        );
    }
}
