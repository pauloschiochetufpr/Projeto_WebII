package com.manutencao.trabalhoweb2.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.manutencao.trabalhoweb2.model.Solicitacao;

@Repository
public interface SolicitacaoRepository extends JpaRepository<Solicitacao, Long> {
    List<Solicitacao> findByClienteId(Long clienteId);
    List<Solicitacao> findByFuncionarioId(Long funcionarioId);
    List<Solicitacao> findByStatus(String status);
    List<Solicitacao> findByAtivoTrue();
    List<Solicitacao> findByDateToday(LocalDateTime date);
    List<Solicitacao> findByDateBetween(LocalDateTime startDate, LocalDateTime endDate);
}
