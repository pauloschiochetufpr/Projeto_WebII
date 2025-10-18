package com.manutencao.trabalhoweb2.service;

import com.manutencao.trabalhoweb2.model.Solicitacao;
import com.manutencao.trabalhoweb2.repository.SolicitacaoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class SolicitacaoService {

    @Autowired
    private SolicitacaoRepository solicitacaoRepository;
    
    public List<Solicitacao> listarTodas() {
        return solicitacaoRepository.findAll();
    }

    public Optional<Solicitacao> buscarPorId(Long id) {
        return solicitacaoRepository.findById(id);
    }

    public List<Solicitacao> buscarPorCliente(Long clienteId) {
        try {
            return solicitacaoRepository.findByCliente_IdCliente(clienteId);
        } catch (Exception e) {
            System.err.println("Erro ao buscar por cliente: " + e.getMessage());
            return List.of();
        }
    }

    // public List<Solicitacao> buscarPorFuncionario(Long funcionarioId) {
    //     try {
    //         return solicitacaoRepository.findByFuncionario_IdFuncionario(funcionarioId);
    //     } catch (Exception e) {
    //         System.err.println("Erro ao buscar por funcionário: " + e.getMessage());
    //         return List.of();
    //     }
    // }

    public List<Solicitacao> buscarPorStatus(Integer status) {
        return solicitacaoRepository.findByIdStatus(status);
    }

    // public List<Solicitacao> buscarAtivas() {
    //     return solicitacaoRepository.findByAtivoTrue();
    // }

    // public List<Solicitacao> buscarHoje() {
    //     return solicitacaoRepository.findByDateToday(LocalDateTime.now());
    // }

    // public List<Solicitacao> buscarPorPeriodo(LocalDateTime inicio, LocalDateTime fim) {
    //     return solicitacaoRepository.findByDateBetween(inicio, fim);
    // }

    public Solicitacao salvar(Solicitacao solicitacao) {
        if (solicitacao.getAtivo() == null) {
            solicitacao.setAtivo(true);
        }
        return solicitacaoRepository.save(solicitacao);
    }

    public Optional<Solicitacao> atualizarStatus(Long id, Integer novoStatus) {
        Optional<Solicitacao> opt = solicitacaoRepository.findById(id);
        if (opt.isPresent()) {
            Solicitacao s = opt.get();
            s.setIdStatus(novoStatus);
            return Optional.of(solicitacaoRepository.save(s));
        }
        return Optional.empty();
    }

    public boolean desativar(Long id) {
        Optional<Solicitacao> opt = solicitacaoRepository.findById(id);
        if (opt.isPresent()) {
            Solicitacao s = opt.get();
            s.setAtivo(false);
            solicitacaoRepository.save(s);
            return true;
        }
        return false;
    }

    public boolean deletar(Long id) {
        if (!solicitacaoRepository.existsById(id)) return false;
        solicitacaoRepository.deleteById(id);
        return true;
    }
}
