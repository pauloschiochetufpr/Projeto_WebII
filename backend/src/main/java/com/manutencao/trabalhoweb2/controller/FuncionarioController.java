package com.manutencao.trabalhoweb2.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.util.List;

import com.manutencao.trabalhoweb2.dto.FuncionarioDto;
import com.manutencao.trabalhoweb2.service.FuncionarioService;

@RestController
@RequestMapping("/api/funcionarios")
@CrossOrigin("*")
public class FuncionarioController {

    private final FuncionarioService funcionarioService;

    public FuncionarioController(FuncionarioService funcionarioService) {
        this.funcionarioService = funcionarioService;
    }

    @GetMapping
    public ResponseEntity<List<FuncionarioDto>> listar() {
        List<FuncionarioDto> list = funcionarioService.listarTodos();
        return ResponseEntity.ok(list);
    }
}
