package com.manutencao.trabalhoweb2.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.manutencao.trabalhoweb2.model.HistSolicitacao;

@Repository
public interface HistSolicitacaoRepository extends JpaRepository<HistSolicitacao, Long> {
    List<HistSolicitacao> findByIdSolicitacao(Long solicitacaoId);
}
