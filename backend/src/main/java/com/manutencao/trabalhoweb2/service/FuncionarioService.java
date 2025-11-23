package com.manutencao.trabalhoweb2.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

import com.manutencao.trabalhoweb2.repository.FuncionarioRepository;
import com.manutencao.trabalhoweb2.dto.FuncionarioDto;

@Service
public class FuncionarioService {

    private final FuncionarioRepository funcionarioRepository;

    public FuncionarioService(FuncionarioRepository funcionarioRepository) {
        this.funcionarioRepository = funcionarioRepository;
    }

    @Transactional(readOnly = true)
    public List<FuncionarioDto> listarTodos() {
        return funcionarioRepository.findAll()
            .stream()
            .map(f -> new FuncionarioDto(f.getIdFuncionario(), f.getNome()))
            .collect(Collectors.toList());
    }
}
