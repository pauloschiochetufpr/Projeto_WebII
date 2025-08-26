package com.manutencao.trabalhoweb2.controller;

import org.springframework.web.bind.annotation.*;
import com.manutencao.trabalhoweb2.dto.LoginRequest;
import com.manutencao.trabalhoweb2.dto.CadastroRequest;

@RestController
@RequestMapping("/api") //prefixo das chamadas
public class AuthController {

    @PostMapping("/login")
    public String login(@RequestBody LoginRequest login) {
        return "Login recebido: " + login.getEmail();
    }

    @PostMapping("/cadastro")
    public String cadastro(@RequestBody CadastroRequest cadastro) {
        return "Cadastro recebido para: " + cadastro.getNome();
    }
}
