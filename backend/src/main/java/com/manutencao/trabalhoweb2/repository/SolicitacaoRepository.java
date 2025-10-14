package com.manutencao.trabalhoweb2.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.manutencao.trabalhoweb2.model.Solicitacao;
import com.manutencao.trabalhoweb2.dto.ReceitaPorCategoriaDTO;

@Repository
public interface SolicitacaoRepository extends JpaRepository<Solicitacao, Long> {
    List<Solicitacao> findByIdCliente(Long clienteId);
    List<Solicitacao> findByIdFuncionario(Long funcionarioId);
    List<Solicitacao> findByStatus(String status);
    List<Solicitacao> findByAtivoTrue();
    List<Solicitacao> findByDateToday(LocalDateTime date);
    List<Solicitacao> findByDateBetween(LocalDateTime startDate, LocalDateTime endDate);

 /**
  * RF19 nao deu tempo de checar o backend(alterar depois?)
  */  
 @Query("SELECT s FROM Solicitacao s WHERE s.status = 'PAGA' AND " +
           "(:startDate IS NULL OR s.dataPagamento >= :startDate) AND " +
           "(:endDate IS NULL OR s.dataPagamento <= :endDate)")
    List<Solicitacao> findServicosPagosByPeriod(
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate);

    /**
     * RF020
     */
    @Query("SELECT new com.manutencao.trabalhoweb2.dto.ReceitaPorCategoriaDTO(" +
           "s.categoria.nome, SUM(s.valorOrcado), COUNT(s)) " +
           "FROM Solicitacao s " +
           "WHERE s.status = 'PAGA' " +
           "GROUP BY s.categoria.nome " +
           "ORDER BY SUM(s.valorOrcado) DESC")
    List<ReceitaPorCategoriaDTO> aggregateRevenueByCategory();
}