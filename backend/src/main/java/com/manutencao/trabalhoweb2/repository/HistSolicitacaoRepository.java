package com.manutencao.trabalhoweb2.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import com.manutencao.trabalhoweb2.model.HistSolicitacao;

@Repository
public interface HistSolicitacaoRepository extends JpaRepository<HistSolicitacao, Long> {
    @Query("SELECT h FROM HistSolicitacao h WHERE h.solicitacao.idSolicitacao = :solicitacaoId ORDER BY h.dataHora DESC")
    List<HistSolicitacao> findBySolicitacao_IdSolicitacao(Long solicitacaoId);
}
