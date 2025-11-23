package com.manutencao.trabalhoweb2.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.manutencao.trabalhoweb2.model.HistSolicitacao;
import com.manutencao.trabalhoweb2.model.Solicitacao;
import com.manutencao.trabalhoweb2.dto.ReceitaPorCategoriaDTO;
import com.manutencao.trabalhoweb2.dto.SolicitacaoDto;

@Repository
public interface SolicitacaoRepository extends JpaRepository<Solicitacao, Long> {

    List<Solicitacao> findByIdStatus(Integer status);

@Repository
    public interface HistSolicitacaoRepository extends JpaRepository<HistSolicitacao, Long> {
    List<HistSolicitacao> findBySolicitacaoIdSolicitacao(Long idSolicitacao);
}

// join com a última data de histórico filtrando pelo cliente
@Query("""
    SELECT s, MAX(h.dataHora) AS lastUpdate
    FROM Solicitacao s
    LEFT JOIN HistSolicitacao h ON h.solicitacao.idSolicitacao = s.idSolicitacao
    WHERE s.cliente.idCliente = :clienteId
    GROUP BY s
""")
List<Object[]> findAllLastUpdateByClienteId(@Param("clienteId") Long clienteId);

// join de cliente com o ultimo historico feito
@Query("""
    SELECT 
        s.idSolicitacao,
        s.nome,
        s.descricao,
        c.idCliente,
        s.valor,
        s.idStatus,
        s.idCategoria,
        s.ativo,
        MAX(h.dataHora) AS lastUpdate,
        c.nome AS nomeCliente,
        (
            SELECT h2.statusOld FROM HistSolicitacao h2 
            WHERE h2.solicitacao.idSolicitacao = s.idSolicitacao 
            ORDER BY h2.dataHora DESC LIMIT 1
        ) AS statusOld,
        (
            SELECT h3.statusNew FROM HistSolicitacao h3 
            WHERE h3.solicitacao.idSolicitacao = s.idSolicitacao 
            ORDER BY h3.dataHora DESC LIMIT 1
        ) AS statusNew,
        (
            SELECT h4.funcionarioOld FROM HistSolicitacao h4 
            WHERE h4.solicitacao.idSolicitacao = s.idSolicitacao 
            ORDER BY h4.dataHora DESC LIMIT 1
        ) AS funcionarioOld,
        (
            SELECT h5.funcionarioNew FROM HistSolicitacao h5 
            WHERE h5.solicitacao.idSolicitacao = s.idSolicitacao 
            ORDER BY h5.dataHora DESC LIMIT 1
        ) AS funcionarioNew
    FROM Solicitacao s
    LEFT JOIN s.cliente c
    LEFT JOIN HistSolicitacao h ON h.solicitacao.idSolicitacao = s.idSolicitacao
    GROUP BY s.idSolicitacao, s.nome, s.descricao, c.idCliente, s.valor, s.idStatus,
             s.idCategoria, s.ativo, c.nome
    ORDER BY s.idSolicitacao ASC
""")
List<Object[]> findAllWithHistory();


// join com a ultima data de historico
@Query("""
    SELECT s, MAX(h.dataHora) AS lastUpdate
    FROM Solicitacao s
    LEFT JOIN HistSolicitacao h ON h.solicitacao.idSolicitacao = s.idSolicitacao
    GROUP BY s
""")
List<Object[]> findAllLastUpdate();

@Query("""
    SELECT s, MAX(h.dataHora) AS lastUpdate
    FROM Solicitacao s
    LEFT JOIN HistSolicitacao h ON h.solicitacao.idSolicitacao = s.idSolicitacao
    WHERE s.idStatus = 1
       OR s.idSolicitacao IN (
            SELECT hs.solicitacao.idSolicitacao
            FROM HistSolicitacao hs
            WHERE hs.funcionarioNew = :idFunc
       )
    GROUP BY s.idSolicitacao
""")
List<Object[]> findAllLastUpdateByFuncionario(@Param("idFunc") Long idFunc);

}
 /**
  * RF19 nao deu tempo de checar o backend(alterar depois?)
  */  
//  @Query("SELECT s FROM Solicitacao s WHERE s.status = 'PAGA' AND " +
//            "(:startDate IS NULL OR s.dataPagamento >= :startDate) AND " +
//            "(:endDate IS NULL OR s.dataPagamento <= :endDate)")
//     List<Solicitacao> findServicosPagosByPeriod(
//         @Param("startDate") LocalDateTime startDate,
//         @Param("endDate") LocalDateTime endDate);

    /**
     * RF020
     */
    // @Query("SELECT new com.manutencao.trabalhoweb2.dto.ReceitaPorCategoriaDTO(" +
    //        "s.categoria.nome, SUM(s.valorOrcado), COUNT(s)) " +
    //        "FROM Solicitacao s " +
    //        "WHERE s.status = 'PAGA' " +
    //        "GROUP BY s.categoria.nome " +
    //        "ORDER BY SUM(s.valorOrcado) DESC")
    // List<ReceitaPorCategoriaDTO> aggregateRevenueByCategory();
