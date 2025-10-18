package com.manutencao.trabalhoweb2.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.manutencao.trabalhoweb2.model.HistSolicitacao;
import com.manutencao.trabalhoweb2.repository.HistSolicitacaoRepository;

@Service
public class HistSolicitacaoService {
    
    private HistSolicitacaoRepository histSolicitacaoRepository;

    public List<HistSolicitacao> getHistoricoPorSolicitacaoId(Long solicitacaoId) {
        return histSolicitacaoRepository.findBySolicitacao_IdSolicitacao(solicitacaoId);
    }
}
