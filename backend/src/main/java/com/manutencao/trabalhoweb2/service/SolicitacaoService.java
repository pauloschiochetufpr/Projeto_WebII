package com.manutencao.trabalhoweb2.service;

import com.manutencao.trabalhoweb2.dto.SolicitacaoDto;
import com.manutencao.trabalhoweb2.model.Cliente;
import com.manutencao.trabalhoweb2.model.Solicitacao;
import com.manutencao.trabalhoweb2.repository.ClienteRepository;
import com.manutencao.trabalhoweb2.repository.SolicitacaoRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

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
