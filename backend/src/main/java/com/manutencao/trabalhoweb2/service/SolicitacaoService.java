package com.manutencao.trabalhoweb2.service;

import com.manutencao.trabalhoweb2.dto.SolicitacaoDto;
import com.manutencao.trabalhoweb2.dto.SolicitacaoLastUpdateDto;
import com.manutencao.trabalhoweb2.model.Cliente;
import com.manutencao.trabalhoweb2.model.Solicitacao;
import com.manutencao.trabalhoweb2.repository.ClienteRepository;
import com.manutencao.trabalhoweb2.repository.SolicitacaoRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class SolicitacaoService {

    @Autowired
    private SolicitacaoRepository solicitacaoRepository;

    @Autowired
    private ClienteRepository clienteRepository;

    // 🔹 LISTAR TODAS
    public List<Solicitacao> listarTodas() {
        return solicitacaoRepository.findAll();
    }

    // 🔹 BUSCAR POR ID
    public Optional<Solicitacao> buscarPorId(Long id) {
        return solicitacaoRepository.findById(id);
    }

    // 🔹 CRIAR NOVA SOLICITAÇÃO
    @Transactional
    public Solicitacao criar(SolicitacaoDto dto) {
        Solicitacao s = new Solicitacao();
        atualizarCampos(s, dto);
        return solicitacaoRepository.save(s);
    }

    // 🔹 ATUALIZAR EXISTENTE
    @Transactional
    public Solicitacao atualizar(Long id, SolicitacaoDto dto) {
        Solicitacao existente = solicitacaoRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Solicitação não encontrada: " + id));

        atualizarCampos(existente, dto);
        return solicitacaoRepository.save(existente);
    }

    // 🔹 ALTERAR STATUS
    @Transactional
    public Solicitacao atualizarStatus(Long id, Integer novoStatus) {
        Solicitacao s = solicitacaoRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Solicitação não encontrada: " + id));

        s.setIdStatus(novoStatus);
        return solicitacaoRepository.save(s);
    }

    // 🔹 DESATIVAR (soft delete)
    @Transactional
    public void desativar(Long id) {
        Solicitacao solicitacao = solicitacaoRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Solicitação não encontrada: " + id));
        solicitacao.setAtivo(false);
        solicitacaoRepository.save(solicitacao);
    }

    // 🔹 EXCLUIR (hard delete)
    @Transactional
    public void deletar(Long id) {
        solicitacaoRepository.deleteById(id);
    }

    // 🔹 BUSCAR POR STATUS
    public List<Solicitacao> buscarPorStatus(Integer idStatus) {
        return solicitacaoRepository.findByIdStatus(idStatus);
    }

    // BUSCAR TODAS COM ÚLTIMA ATUALIZAÇÃO
    public List<SolicitacaoLastUpdateDto> listarTodasComLastUpdate() {
    List<Object[]> rows = solicitacaoRepository.findAllLastUpdate();

    DateTimeFormatter fmt = DateTimeFormatter.ISO_DATE_TIME;
    ZoneId zone = ZoneId.systemDefault(); // ou ZoneOffset.UTC se quiser UTC

    return rows.stream().map(row -> {
        Solicitacao s = (Solicitacao) row[0];
        Object lastObj = row[1]; // pode ser LocalDateTime, Timestamp, Date ou null

        String lastIso = null;
        if (lastObj != null) {
            if (lastObj instanceof LocalDateTime ldt) {
                lastIso = ldt.format(fmt);
            } else if (lastObj instanceof Timestamp ts) {
                // Timestamp -> LocalDateTime
                LocalDateTime ldt = ts.toLocalDateTime();
                lastIso = ldt.format(fmt);
            } else if (lastObj instanceof java.util.Date d) {
                Instant ins = Instant.ofEpochMilli(d.getTime());
                LocalDateTime ldt = LocalDateTime.ofInstant(ins, zone);
                lastIso = ldt.format(fmt);
            } else {
                // fallback: tentar toString e parse (defensivo)
                try {
                    LocalDateTime ldt = LocalDateTime.parse(lastObj.toString());
                    lastIso = ldt.format(fmt);
                } catch (Exception e) {
                    lastIso = lastObj.toString();
                }
            }
        }

        return new SolicitacaoLastUpdateDto(
            s.getIdSolicitacao(),
            s.getNome(),
            s.getDescricao(),
            s.getCliente() != null ? s.getCliente().getIdCliente() : null,
            s.getValor(),
            s.getIdStatus(),
            s.getIdCategoria(),
            s.getAtivo(),
            lastIso
        );
    }).collect(Collectors.toList());
}

    // ================================================================
    // 🔧 MÉTODO PRIVADO DE MAPEAMENTO DTO → ENTIDADE
    // ================================================================
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
