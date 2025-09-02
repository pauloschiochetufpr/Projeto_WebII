package com.manutencao.trabalhoweb2.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.manutencao.trabalhoweb2.dto.LoginRequest;
import com.manutencao.trabalhoweb2.dto.CadastroRequest;
import com.manutencao.trabalhoweb2.model.Usuario;
import com.manutencao.trabalhoweb2.repository.UsuarioRepository;

@RestController
@RequestMapping("/api") //prefixo das chamadas
public class AuthController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @PostMapping("/cadastro")
    public String cadastro(@RequestBody CadastroRequest cadastro) {
        if (usuarioRepository.findByEmail(cadastro.email()).isPresent()) {
            return "Erro: email já cadastrado";
        }

        Usuario usuario = new Usuario(
            cadastro.email(),
            cadastro.nome(),
            cadastro.cpf(),
            cadastro.cep(),
            cadastro.telefone()
        );
        usuarioRepository.save(usuario);
        return "Cadastro realizado com sucesso";
    }

    @PostMapping("/login")
    public String login(@RequestBody LoginRequest login) {
        return usuarioRepository.findByEmail(login.email())
                .filter(u -> u.getEmail().equals(login.email())) // no futuro comparar senha hash
                .map(u -> "Login ok")
                .orElse("Usuário não encontrado");
    }
}