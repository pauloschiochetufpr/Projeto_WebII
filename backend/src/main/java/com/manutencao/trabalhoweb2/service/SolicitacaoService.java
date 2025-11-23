package com.manutencao.trabalhoweb2.service;

import com.manutencao.trabalhoweb2.dto.AtualizarStatusDto;
import com.manutencao.trabalhoweb2.dto.SolicitacaoDto;
import com.manutencao.trabalhoweb2.dto.SolicitacaoLastUpdateDto;
import com.manutencao.trabalhoweb2.dto.SolicitacaoResponseDto;
import com.manutencao.trabalhoweb2.model.*;
import com.manutencao.trabalhoweb2.repository.*;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class SolicitacaoService {

    @Autowired
    private final SolicitacaoRepository solicitacaoRepository;

    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private HistSolicitacaoRepository histSolicitacaoRepository;

    public SolicitacaoService(SolicitacaoRepository solicitacaoRepository) {
        this.solicitacaoRepository = solicitacaoRepository;
    }

    public SolicitacaoResponseDto toDto(Solicitacao s) {
    return new SolicitacaoResponseDto(
            s.getIdSolicitacao(),
            s.getNome(),
            s.getDescricao(),
            s.getValor(),
            s.getIdStatus(),
            s.getIdCategoria(),
            s.getAtivo(),
            s.getCliente() != null ? s.getCliente().getIdCliente() : null,
            s.getCliente() != null ? s.getCliente().getNome() : null
    );
}


    // ===============================================================
// LISTAR TODAS COM JOIN (COMPLETO)
// ===============================================================
public List<SolicitacaoLastUpdateDto> listarTodasComUltimoHistorico() {
    List<Object[]> resultados = solicitacaoRepository.findAllWithHistory();

    return resultados.stream().map(obj -> new SolicitacaoLastUpdateDto(
            (Long) obj[0],                      // idSolicitacao
            (String) obj[1],                    // nome
            (String) obj[2],                    // descricao
            (Long) obj[3],                      // idCliente
            (BigDecimal) obj[4],                // valor
            (Integer) obj[5],                   // idStatus
            (Integer) obj[6],                   // idCategoria
            (Boolean) obj[7],                   // ativo
            obj[8] != null ? obj[8].toString() : null, // lastUpdate
            (String) obj[9],                    // nomeCliente
            (String) obj[10],                   // statusOld
            (String) obj[11],                   // statusNew
            obj[12] != null ? ((Number) obj[12]).longValue() : null, // funcionarioOld
            obj[13] != null ? ((Number) obj[13]).longValue() : null  // funcionarioNew
    )).collect(Collectors.toList());
}

// ===============================================================
// LISTAR COM LAST UPDATE 
// ===============================================================
public List<SolicitacaoLastUpdateDto> listarTodasComLastUpdate() {
    List<Object[]> rows = solicitacaoRepository.findAllLastUpdate();

    return rows.stream().map(row -> {
        Solicitacao s = (Solicitacao) row[0];
        Object lastObj = row[1];
        String lastIso = (lastObj != null) ? lastObj.toString() : null;

        String nomeCliente = (s.getCliente() != null) ? s.getCliente().getNome() : null;

        return new SolicitacaoLastUpdateDto(
                s.getIdSolicitacao(),
                s.getNome(),
                s.getDescricao(),
                s.getCliente() != null ? s.getCliente().getIdCliente() : null,
                s.getValor(),
                s.getIdStatus(),
                s.getIdCategoria(),
                s.getAtivo(),
                lastIso,
                nomeCliente,
                null, null, null, null
        );
    }).collect(Collectors.toList());
}

// ===============================================================
// LISTAR TODAS POR FUNCIONÁRIO COM LAST UPDATE
// ===============================================================
@Transactional(readOnly = true)
public List<SolicitacaoLastUpdateDto> listarPorFuncionarioComLastUpdate(Long idFuncionario) {
    // chama a query nova do repository
    List<Object[]> rows = solicitacaoRepository.findAllLastUpdateByFuncionario(idFuncionario);

    return rows.stream().map(row -> {
        Solicitacao s = (Solicitacao) row[0];
        Object lastObj = row[1];
        String lastIso = (lastObj != null) ? lastObj.toString() : null;

        String nomeCliente = (s.getCliente() != null) ? s.getCliente().getNome() : null;

        return new SolicitacaoLastUpdateDto(
                s.getIdSolicitacao(),
                s.getNome(),
                s.getDescricao(),
                s.getCliente() != null ? s.getCliente().getIdCliente() : null,
                s.getValor(),
                s.getIdStatus(),
                s.getIdCategoria(),
                s.getAtivo(),
                lastIso,
                nomeCliente,
                null, // mantenho os mesmos campos nulos que você usava
                null,
                null,
                null
        );
    }).collect(Collectors.toList());
}

// ===============================================================
// LISTAR TODAS POR CLIENTE COM LAST UPDATE
// ===============================================================
public List<SolicitacaoLastUpdateDto> listarPorClienteComLastUpdate(Long clienteId) {
    List<Object[]> rows = solicitacaoRepository.findAllLastUpdateByClienteId(clienteId);

    return rows.stream().map(row -> {
        Solicitacao s = (Solicitacao) row[0];
        Object lastObj = row[1];
        String lastIso = (lastObj != null) ? lastObj.toString() : null;

        String nomeCliente = (s.getCliente() != null) ? s.getCliente().getNome() : null;

        return new SolicitacaoLastUpdateDto(
                s.getIdSolicitacao(),
                s.getNome(),
                s.getDescricao(),
                s.getCliente() != null ? s.getCliente().getIdCliente() : null,
                s.getValor(),
                s.getIdStatus(),
                s.getIdCategoria(),
                s.getAtivo(),
                lastIso,
                nomeCliente,
                null, null, null, null
        );
    }).collect(Collectors.toList());
}

    // ===============================================================
    // CRUD BÁSICO
    // ===============================================================
    public List<Solicitacao> listarTodas() {
        return solicitacaoRepository.findAll();
    }

    public Optional<Solicitacao> buscarPorId(Long id) {
        return solicitacaoRepository.findById(id);
    }

    @Transactional
   public Solicitacao criar(SolicitacaoDto dto) {
    Solicitacao s = new Solicitacao();
    atualizarCampos(s, dto);

    Solicitacao saved = solicitacaoRepository.save(s);

    HistSolicitacao hist = new HistSolicitacao();
    hist.setSolicitacao(saved);
    hist.setCliente(true);
    hist.setStatusOld(null);
    hist.setStatusNew("ABERTA");
    hist.setFuncionarioOld(null);
    hist.setFuncionarioNew(null);
    hist.setDataHora(LocalDateTime.now());

    histSolicitacaoRepository.save(hist);

    return saved;
}

    @Transactional
    public Solicitacao atualizar(Long id, SolicitacaoDto dto) {
        Solicitacao existente = solicitacaoRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Solicitação não encontrada: " + id));

        // captura estado anterior (pode ser null)
        Integer statusAntigoId = existente.getIdStatus();
        String statusAntigoStr = statusAntigoId != null ? String.valueOf(statusAntigoId) : null;

        // atualiza campos (mesma lógica que você já tinha)
        atualizarCampos(existente, dto);

        // salva a solicitação atualizada
        Solicitacao salva = solicitacaoRepository.save(existente);

        // cria e salva histórico — ajuste 'cliente' se precisar diferenciar quem fez a alteração
        HistSolicitacao hist = new HistSolicitacao();
        hist.setSolicitacao(salva);
        hist.setCliente(false); // aqui: false = ação por funcionário/sistema. Se for cliente, envie essa info no DTO.
        hist.setStatusOld(statusAntigoStr);
        hist.setStatusNew(salva.getIdStatus() != null ? String.valueOf(salva.getIdStatus()) : null);
        hist.setFuncionarioOld(null);
        hist.setFuncionarioNew(null);
        hist.setDataHora(LocalDateTime.now());
        // se sua entidade tem campo 'motivo' e você quiser registrar, adicione hist.setMotivo(dto.getMotivo()) se existir

        histSolicitacaoRepository.save(hist);

        return salva;
    }

    @Transactional
    public void desativar(Long id) {
        Solicitacao solicitacao = solicitacaoRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Solicitação não encontrada: " + id));
        solicitacao.setAtivo(false);
        solicitacaoRepository.save(solicitacao);
    }

    @Transactional
    public void deletar(Long id) {
        solicitacaoRepository.deleteById(id);
    }

    public List<Solicitacao> buscarPorStatus(Integer idStatus) {
        return solicitacaoRepository.findByIdStatus(idStatus);
    }

    // ===============================================================
    // ALTERAÇÃO DE STATUS + HISTÓRICO
    // ===============================================================
   @Transactional
    public Solicitacao atualizarStatus(Long id, AtualizarStatusDto dto) {
    Solicitacao solicitacao = solicitacaoRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Solicitação não encontrada"));

    Integer novoStatusId = dto.getNovoStatus();
    if (novoStatusId == null) {
        throw new IllegalArgumentException("Novo status não pode ser nulo");
    }

    // Guarda o status anterior
    Integer statusAntigo = solicitacao.getIdStatus();

    // Atualiza o ID de status
    solicitacao.setIdStatus(novoStatusId);

    // pega ultimo historico (se existir) para obter funcionarioNew anterior
    Optional<HistSolicitacao> ultimoOpt = histSolicitacaoRepository.findTopBySolicitacaoOrderByDataHoraDesc(solicitacao);

    Integer funcionarioOldId = null;
    if (ultimoOpt.isPresent()) {
        // supondo que em HistSolicitacao.funcionarioNew o tipo seja Long (id)
        funcionarioOldId = ultimoOpt.get().getFuncionarioNew(); // Long
    }


    // Cria histórico
    HistSolicitacao historico = new HistSolicitacao();
    historico.setSolicitacao(solicitacao);
    historico.setCliente(dto.isCliente());
    historico.setStatusOld(statusAntigo != null ? statusAntigo.toString() : "N/A");
    historico.setStatusNew(novoStatusId.toString());
    // define funcionarioOld com o id do último funcionarioNew (pode ser null)
    historico.setFuncionarioOld(funcionarioOldId);

    // funcionarioNew vem do DTO (se o front passou); caso contrário, mantém null
    if (dto.getFuncionarioId() != null) {
        historico.setFuncionarioNew(dto.getFuncionarioId());
    } else {
        historico.setFuncionarioNew(null);
    }

    historico.setDataHora(LocalDateTime.now());

    histSolicitacaoRepository.save(historico);
    historico.setDataHora(LocalDateTime.now());

    histSolicitacaoRepository.save(historico);

    // Salva solicitação atualizada
    return solicitacaoRepository.save(solicitacao);
}


    // ===============================================================
    // HELPER
    // ===============================================================
    private void atualizarCampos(Solicitacao s, SolicitacaoDto dto) {
        s.setNome(dto.nome());
        s.setDescricao(dto.descricao());
        s.setValor(dto.valor());
        s.setIdStatus(dto.idStatus());
        s.setIdCategoria(dto.idCategoria());
        s.setAtivo(dto.ativo() != null ? dto.ativo() : true);

        if (dto.idCliente() != null) {
            Cliente cliente = clienteRepository.findById(dto.idCliente())
                    .orElseThrow(() -> new EntityNotFoundException("Cliente não encontrado: " + dto.idCliente()));
            s.setCliente(cliente);
        } else {
            s.setCliente(null);
        }
    }
}
