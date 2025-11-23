package com.manutencao.trabalhoweb2.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import com.manutencao.trabalhoweb2.model.HistSolicitacao;
import com.manutencao.trabalhoweb2.model.Solicitacao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.manutencao.trabalhoweb2.model.HistSolicitacao;
import com.manutencao.trabalhoweb2.dto.ReceitaDiariaDTO;

@Repository
public interface HistSolicitacaoRepository extends JpaRepository<HistSolicitacao, Long> {
    
    @Query("SELECT h FROM HistSolicitacao h WHERE h.solicitacao.idSolicitacao = :solicitacaoId ORDER BY h.dataHora DESC")
    List<HistSolicitacao> findBySolicitacao_IdSolicitacao(Long solicitacaoId);
    
    // Relatório de Receitas por Período
    @Query("SELECT new com.manutencao.trabalhoweb2.dto.ReceitaDiariaDTO(" +
           "CAST(h.dataHora AS LocalDate), " +
           "SUM(s.valor), " +
           "COUNT(DISTINCT h.solicitacao.idSolicitacao)) " +
           "FROM HistSolicitacao h " +
           "JOIN h.solicitacao s " +
           "WHERE s.ativo = true " +
           "AND s.valor IS NOT NULL " +
           "AND (:dataInicial IS NULL OR CAST(h.dataHora AS LocalDate) >= :dataInicial) " +
           "AND (:dataFinal IS NULL OR CAST(h.dataHora AS LocalDate) <= :dataFinal) " +
           "GROUP BY CAST(h.dataHora AS LocalDate) " +
           "ORDER BY CAST(h.dataHora AS LocalDate)")
    List<ReceitaDiariaDTO> buscarReceitasAgrupadasPorDia(
        @Param("dataInicial") LocalDate dataInicial,
        @Param("dataFinal") LocalDate dataFinal
    );

    Optional<HistSolicitacao> findTopBySolicitacaoOrderByDataHoraDesc(Solicitacao solicitacao);
}