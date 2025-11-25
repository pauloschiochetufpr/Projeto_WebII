package com.manutencao.trabalhoweb2.controller;

import com.manutencao.trabalhoweb2.dto.FuncionarioCreateDto;
import com.manutencao.trabalhoweb2.dto.FuncionarioDto;
import com.manutencao.trabalhoweb2.dto.FuncionarioUpdateDto;
import com.manutencao.trabalhoweb2.service.FuncionarioService;
import com.manutencao.trabalhoweb2.model.Funcionario;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

@RestController
@RequestMapping("/api/funcionarios")
@CrossOrigin(origins = "http://localhost:4200")
public class FuncionarioController {

    private final FuncionarioService service;

    public FuncionarioController(FuncionarioService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<FuncionarioDto>> listar() {
        return ResponseEntity.ok(service.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<FuncionarioDto> buscar(@PathVariable Long id) {
        return ResponseEntity.ok(service.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<FuncionarioDto> criar(@Valid @RequestBody FuncionarioCreateDto dto) {
        FuncionarioDto criado = service.criar(dto);
        return ResponseEntity.ok(criado);
    }

    @PutMapping("/{id}")
    public ResponseEntity<FuncionarioDto> atualizar(
            @PathVariable Long id,
            @Valid @RequestBody FuncionarioUpdateDto dto) {
        FuncionarioDto atualizado = service.atualizar(id, dto);
        return ResponseEntity.ok(atualizado);
    }

    /**
     * DELETE - remoção lógica (desativa)
     * - tenta inferir o ID do usuário atual via SecurityContext
     * - se não houver autenticação, admite o header X-USER-ID com o id do funcionário executando a ação
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(
            @PathVariable Long id,
            @RequestHeader(value = "X-USER-ID", required = false) Long headerUserId) {

        Long currentUserId = null;

        // Tentar pegar do SecurityContext (se o projeto tiver autenticação configurada)
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.isAuthenticated() && auth.getPrincipal() != null) {
                Object principal = auth.getPrincipal();
                // Caso o principal seja um username (email), tentar buscar funcionário por email
                if (principal instanceof String) {
                    String username = (String) principal;
                    // Aqui tentamos converter username (email) para id consultando o service/repo.
                    // Como o service não expõe findByEmail -> buscaria o repositório
                    // Para não adicionar dependência adicional aqui, usamos header fallback.
                    // Portanto se Security estiver configurado, adapte este trecho para extrair o id do token.
                }
            }
        } catch (Exception e) {
            // ignore - fallback para header
        }

        // Se não obteve via SecurityContext, usa header
        if (currentUserId == null) {
            currentUserId = headerUserId;
        }

        service.deletar(id, currentUserId);
        return ResponseEntity.noContent().build();
    }
}
