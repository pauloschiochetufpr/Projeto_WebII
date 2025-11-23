package com.manutencao.trabalhoweb2.rest;

import java.time.LocalDate;
import java.util.*;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RestController;

import com.manutencao.trabalhoweb2.model.Funcionario;

import jakarta.persistence.Column;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;






@CrossOrigin
@RestController

public class FuncionarioREST {
    public static List<Funcionario> lista = new ArrayList<>();

    @GetMapping("/usuarios")
    public List<Funcionario> obterTodosFuncionarios(){
        return lista;
    }
    
    
    static {
        lista.add(
            new Funcionario(
                1L,
                "João da Silva",
                "joao@email.com",
                LocalDate.of(1990, 5, 20),
                "41999999999",
                "hashDaSenhaAqui",
                true
    )
);
    }
}

