package com.manutencao.trabalhoweb2.service;

import com.manutencao.trabalhoweb2.dto.FuncionarioCreateDto;
import com.manutencao.trabalhoweb2.dto.FuncionarioDto;
import com.manutencao.trabalhoweb2.dto.FuncionarioUpdateDto;
import com.manutencao.trabalhoweb2.model.Funcionario;
import com.manutencao.trabalhoweb2.repository.FuncionarioRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.crypto.bcrypt.BCrypt;

import java.util.List;

@Service
public class FuncionarioService {

    private final FuncionarioRepository repository;

    public FuncionarioService(FuncionarioRepository repository) {
        this.repository = repository;
    }

    @Transactional(readOnly = true)
    public List<FuncionarioDto> listarTodos() {
        return repository.findAll().stream()
                .map(this::toDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public FuncionarioDto buscarPorId(Long id) {
        Funcionario f = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Funcionário não encontrado"));
        return toDto(f);
    }

    @Transactional
    public FuncionarioDto criar(FuncionarioCreateDto dto) {
        // verificação de e-mail único
        if (repository.findByEmail(dto.email()).isPresent()) {
            throw new RuntimeException("Email já cadastrado");
        }

        Funcionario f = new Funcionario();
        f.setNome(dto.nome());
        f.setEmail(dto.email());
        f.setDataNasc(dto.dataNasc());
        f.setTelefone(dto.telefone());
        f.setAtivo(true);


        // gerar hash com BCrypt (salt interno gerado automaticamente)
        String hashSenha = BCrypt.hashpw(dto.senha(), BCrypt.gensalt());
        f.setSenhaHash(hashSenha);


        repository.save(f);
        return toDto(f);
    }

    @Transactional
    public FuncionarioDto atualizar(Long id, FuncionarioUpdateDto dto) {
        Funcionario f = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Funcionário não encontrado"));

        // email não pode ser alterado por aqui (requisito não cita alteração de email)
        f.setNome(dto.nome());
        f.setDataNasc(dto.dataNasc());
        f.setTelefone(dto.telefone());
        f.setAtivo(dto.ativo());

        repository.save(f);
        return toDto(f);
    }

    /**
     * Remoção lógica: seta ativo = false
     * Regras:
     * - não permite remover se só houver 1 funcionário no sistema
     * - não permite remover o próprio usuário (se for possível identificar)
     *
     * A identificação do "usuário atual" é feita pelo SecurityContext (se houver) ou
     * pelo parâmetro currentUserId passado pela controller (caso não haja autenticação configurada).
     */
    @Transactional
    public void deletar(Long idToDelete, Long currentUserId) {
        long total = repository.count();
        // se tiver 1 func. não pode removê-lo 
        if (total <= 1) {
            throw new RuntimeException("Não é permitido remover o último funcionário do sistema.");
        }

        // não pode remover a si proprio 
        if (currentUserId != null && idToDelete.equals(currentUserId)) {
           throw new RuntimeException("Um funcionário não pode remover a si mesmo.");
        }

        Funcionario f = repository.findById(idToDelete)
                .orElseThrow(() -> new RuntimeException("Funcionário não encontrado"));

        repository.delete(f);
    }

    
    public boolean validarSenhaParaLogin(String rawPassword, String storedHash) {
    if (storedHash == null) return false;
    return BCrypt.checkpw(rawPassword, storedHash);
    }

    private FuncionarioDto toDto(Funcionario f) {
        return new FuncionarioDto(
                f.getIdFuncionario(),
                f.getNome(),
                f.getEmail(),
                f.getDataNasc(),
                f.getTelefone(),
                f.getAtivo()
        );
    }
}
