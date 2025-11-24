package com.manutencao.trabalhoweb2.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.manutencao.trabalhoweb2.model.Solicitacao;

@Repository
public interface SolicitacaoRepository extends JpaRepository<Solicitacao, Long> {

    List<Solicitacao> findByIdStatus(Integer status);


    @Query(value = """
        SELECT 
            s.id_solicitacao,
            s.nome,
            s.descricao,
            s.id_cliente,
            s.valor,
            s.id_status,
            s.id_categoria,
            s.ativo,
            COALESCE(h.data_hora, NULL) AS last_update,
            s.created_at,
            c.nome AS nome_cliente,
            h.status_old,
            h.status_new,
            h.funcionario_old,
            h.funcionario_new
        FROM solicitacao s
        LEFT JOIN (
            SELECT h1.*
            FROM hist_solicitacao h1
            INNER JOIN (
                SELECT id_solicitacao, MAX(data_hora) AS max_time
                FROM hist_solicitacao
                GROUP BY id_solicitacao
            ) hmax ON h1.id_solicitacao = hmax.id_solicitacao AND h1.data_hora = hmax.max_time
        ) h ON h.id_solicitacao = s.id_solicitacao
        LEFT JOIN cliente c ON c.id_cliente = s.id_cliente
        WHERE s.ativo = TRUE
        ORDER BY s.created_at ASC
        """, nativeQuery = true)
    List<Object[]> findAllLastUpdate();

    @Query(value = """
        SELECT 
            s.id_solicitacao,
            s.nome,
            s.descricao,
            s.id_cliente,
            s.valor,
            s.id_status,
            s.id_categoria,
            s.ativo,
            COALESCE(h.data_hora, NULL) AS last_update,
            s.created_at,
            c.nome AS nome_cliente,
            h.status_old,
            h.status_new,
            h.funcionario_old,
            h.funcionario_new
        FROM solicitacao s
        LEFT JOIN (
            SELECT h1.*
            FROM hist_solicitacao h1
            INNER JOIN (
                SELECT id_solicitacao, MAX(data_hora) AS max_time
                FROM hist_solicitacao
                GROUP BY id_solicitacao
            ) hmax ON h1.id_solicitacao = hmax.id_solicitacao AND h1.data_hora = hmax.max_time
        ) h ON h.id_solicitacao = s.id_solicitacao
        LEFT JOIN cliente c ON c.id_cliente = s.id_cliente
        WHERE s.id_cliente = :idCliente
          AND s.ativo = TRUE
        ORDER BY s.created_at ASC
        """, nativeQuery = true)
    List<Object[]> findAllByClienteLastUpdate(@Param("idCliente") Long idCliente);

@Query(value = """
    SELECT 
        s.id_solicitacao,
        s.nome,
        s.descricao,
        s.id_cliente,
        s.valor,
        s.id_status,
        s.id_categoria,
        s.ativo,
        COALESCE(h.data_hora, NULL) AS last_update,
        s.created_at,
        c.nome AS nome_cliente,
        h.status_old,
        h.status_new,
        h.funcionario_old,
        h.funcionario_new
    FROM solicitacao s
    LEFT JOIN (
        SELECT h1.*
        FROM hist_solicitacao h1
        INNER JOIN (
            SELECT id_solicitacao, MAX(data_hora) AS max_time
            FROM hist_solicitacao
            GROUP BY id_solicitacao
        ) hmax ON h1.id_solicitacao = hmax.id_solicitacao AND h1.data_hora = hmax.max_time
    ) h ON h.id_solicitacao = s.id_solicitacao
    LEFT JOIN cliente c ON c.id_cliente = s.id_cliente
    WHERE s.ativo = TRUE
      AND (
            s.id_status = 1
            OR s.id_solicitacao IN (
                SELECT hs.id_solicitacao
                FROM hist_solicitacao hs
                WHERE hs.funcionario_new = :idFunc
            )
      )
    ORDER BY s.created_at ASC
""", nativeQuery = true)
List<Object[]> findAllLastUpdateByFuncionario(@Param("idFunc") Long idFunc);


@Query("""
SELECT DISTINCT s 
FROM Solicitacao s
JOIN HistSolicitacao h ON h.solicitacao.idSolicitacao = s.idSolicitacao
WHERE h.funcionarioNew = :idFunc OR h.funcionarioOld = :idFunc
ORDER BY s.createdAt ASC
""")
List<Solicitacao> findAllByFuncionarioHistorico(@Param("idFunc") Long idFunc);

@Query(value = """
    SELECT 
        s.id_solicitacao,
        s.nome,
        s.descricao,
        s.id_cliente,
        s.valor,
        s.id_status,
        s.id_categoria,
        s.ativo,
        COALESCE(h.data_hora, s.created_at) AS last_update,
        s.created_at,
        c.nome AS nome_cliente
    FROM solicitacao s
    LEFT JOIN (
        SELECT h1.*
        FROM hist_solicitacao h1
        INNER JOIN (
            SELECT id_solicitacao, MAX(data_hora) AS max_time
            FROM hist_solicitacao
            GROUP BY id_solicitacao
        ) hmax
            ON h1.id_solicitacao = hmax.id_solicitacao
            AND h1.data_hora = hmax.max_time
    ) h ON h.id_solicitacao = s.id_solicitacao
    LEFT JOIN cliente c ON c.id_cliente = s.id_cliente
    WHERE s.id_status = 1
      AND s.ativo = TRUE
    ORDER BY s.created_at ASC
""", nativeQuery = true)
List<Object[]> findAbertasComLastUpdate();


}
