package com.manutencao.trabalhoweb2.service;

import com.manutencao.trabalhoweb2.dto.AtualizarStatusDto;
import com.manutencao.trabalhoweb2.dto.SolicitacaoDto;
import com.manutencao.trabalhoweb2.dto.SolicitacaoLastUpdateDto;
import com.manutencao.trabalhoweb2.dto.SolicitacaoResponseDto;

import com.manutencao.trabalhoweb2.model.Cliente;
import com.manutencao.trabalhoweb2.model.HistSolicitacao;
import com.manutencao.trabalhoweb2.model.Solicitacao;

import com.manutencao.trabalhoweb2.repository.ClienteRepository;
import com.manutencao.trabalhoweb2.repository.HistSolicitacaoRepository;
import com.manutencao.trabalhoweb2.repository.SolicitacaoRepository;

import jakarta.persistence.EntityNotFoundException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class SolicitacaoService {

    @Autowired
    private SolicitacaoRepository solicitacaoRepository;

    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private HistSolicitacaoRepository histRepository;

    // ======================================================
    // LISTAGENS SIMPLES
    // ======================================================

    public List<Solicitacao> listarTodasRaw() {
        return solicitacaoRepository.findAll();
    }

    public Optional<Solicitacao> buscarPorId(Long id) {
        return solicitacaoRepository.findById(id);
    }

    public List<Solicitacao> buscarPorStatus(Integer status) {
        return solicitacaoRepository.findByIdStatus(status);
    }

    // ======================================================
    // CONVERSÃO PARA DTO SIMPLES
    // ======================================================

    public SolicitacaoResponseDto toDto(Solicitacao s) {
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

    // ======================================================
    // CRIAR SOLICITAÇÃO
    // ======================================================

    public Solicitacao criar(SolicitacaoDto dto) {
        Solicitacao s = new Solicitacao();
        s.setNome(dto.nome());
        s.setDescricao(dto.descricao());
        s.setValor(dto.valor());
        s.setIdStatus(dto.idStatus());
        s.setIdCategoria(dto.idCategoria());
        s.setAtivo(dto.ativo());
        s.setCreatedAt(LocalDateTime.now());

        if (dto.idCliente() != null) {
            Cliente c = clienteRepository.findById(dto.idCliente())
                    .orElseThrow(() -> new EntityNotFoundException("Cliente não encontrado"));
            s.setCliente(c);
        }

        return solicitacaoRepository.save(s);
    }

    // ======================================================
    // ATUALIZAR SOLICITAÇÃO
    // ======================================================

    public Solicitacao atualizar(Long id, SolicitacaoDto dto) {
        Solicitacao s = solicitacaoRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Solicitação não encontrada"));

        s.setNome(dto.nome());
        s.setDescricao(dto.descricao());
        s.setValor(dto.valor());
        s.setIdStatus(dto.idStatus());
        s.setIdCategoria(dto.idCategoria());
        s.setAtivo(dto.ativo());

        return solicitacaoRepository.save(s);
    }

    // ======================================================
    // SOFT DELETE
    // ======================================================

    public void desativar(Long id) {
        Solicitacao s = solicitacaoRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Solicitação não encontrada"));
        s.setAtivo(false);
        solicitacaoRepository.save(s);
    }

    public void deletar(Long id) {
        solicitacaoRepository.deleteById(id);
    }

    // ======================================================
    // ALTERAR STATUS + HISTÓRICO
    // ======================================================

    public Solicitacao atualizarStatus(Long id, AtualizarStatusDto dto) {

        // Buscar a solicitação
        Solicitacao s = solicitacaoRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Solicitação não encontrada"));

        Integer oldStatus = s.getIdStatus();
        Integer newStatus = dto.getNovoStatus();

        // Atualiza status
        s.setIdStatus(newStatus);

        // Criar registro no histórico
        HistSolicitacao h = new HistSolicitacao();
        h.setSolicitacao(s);
        h.setCliente(dto.isCliente());
        h.setStatusOld(oldStatus != null ? oldStatus.toString() : null);
        h.setStatusNew(newStatus != null ? newStatus.toString() : null);

        h.setFuncionarioOld(null);
        h.setFuncionarioNew(null);

        h.setMotivo(dto.getMotivo());
        h.setDataHora(LocalDateTime.now());

        histRepository.save(h);

        return solicitacaoRepository.save(s);
    }

    // ======================================================
    // LISTAR COM ÚLTIMO HISTÓRICO
    // ======================================================

    public List<SolicitacaoLastUpdateDto> listarTodasComUltimoHistorico() {
        List<Object[]> rows = solicitacaoRepository.findAllLastUpdate();
        return rows.stream()
                .map(this::mapToLastUpdateDto)
                .toList();
    }

    public List<SolicitacaoLastUpdateDto> listarPorCliente(Long idCliente) {
        List<Object[]> rows = solicitacaoRepository.findAllByClienteLastUpdate(idCliente);
        return rows.stream()
                .map(this::mapToLastUpdateDto)
                .toList();
    }

    public List<SolicitacaoLastUpdateDto> listarPorFuncionarioComLastUpdate(Long idFuncionario) {

    List<Object[]> rows = solicitacaoRepository.findAllLastUpdateByFuncionario(idFuncionario);

    return rows.stream().map(row ->
            new SolicitacaoLastUpdateDto(
                    row[0] != null ? ((Number) row[0]).longValue() : null,
                    (String) row[1],
                    (String) row[2],
                    row[3] != null ? ((Number) row[3]).longValue() : null,
                    (BigDecimal) row[4],
                    row[5] != null ? ((Number) row[5]).intValue() : null,
                    row[6] != null ? ((Number) row[6]).intValue() : null,
                    (Boolean) row[7],
                    row[8] != null ? row[8].toString() : null,
                    row[9] != null ? row[9].toString() : null,
                    (String) row[10],
                    row[11] != null ? row[11].toString() : null,
                    row[12] != null ? row[12].toString() : null,
                    row[13] != null ? ((Number) row[13]).longValue() : null,
                    row[14] != null ? ((Number) row[14]).longValue() : null
            )
    ).toList();
}


    // ======================================================
    // MAPEAMENTO Object[] → DTO
    // ======================================================

    private SolicitacaoLastUpdateDto mapToLastUpdateDto(Object[] row) {
        return new SolicitacaoLastUpdateDto(
                // idSolicitacao
                row[0] != null ? ((Number) row[0]).longValue() : null,

                // nome
                (String) row[1],

                // descricao
                (String) row[2],

                // idCliente
                row[3] != null ? ((Number) row[3]).longValue() : null,

                // valor
                (BigDecimal) row[4],

                // idStatus
                row[5] != null ? ((Number) row[5]).intValue() : null,

                // idCategoria
                row[6] != null ? ((Number) row[6]).intValue() : null,

                // ativo
                (Boolean) row[7],

                // lastUpdate
                row[8] != null ? row[8].toString() : null,

                // createdAt
                row[9] != null ? row[9].toString() : null,

                // nomeCliente
                (String) row[10],

                // statusOld
                row[11] != null ? row[11].toString() : null,

                // statusNew
                row[12] != null ? row[12].toString() : null,

                // funcionarioOld
                row[13] != null ? ((Number) row[13]).longValue() : null,

                // funcionarioNew
                row[14] != null ? ((Number) row[14]).longValue() : null
        );
    }
}
