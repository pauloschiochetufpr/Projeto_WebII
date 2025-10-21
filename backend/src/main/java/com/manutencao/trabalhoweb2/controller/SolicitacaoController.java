package com.manutencao.trabalhoweb2.controller;

import com.manutencao.trabalhoweb2.model.Solicitacao;
import com.manutencao.trabalhoweb2.service.SolicitacaoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/solicitacoes")
@CrossOrigin(origins = "*")
public class SolicitacaoController {
  
    @Autowired
    private SolicitacaoService solicitacaoService;

    // Listar todas
    @GetMapping
    public ResponseEntity<List<Solicitacao>> listarTodas() {
        List<Solicitacao> lista = solicitacaoService.listarTodas();
        return ResponseEntity.ok(lista);
    }

    // Buscar por ID
    @GetMapping("/{id}")
    public ResponseEntity<Solicitacao> buscarPorId(@PathVariable Long id) {
        return solicitacaoService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Buscar por status
    @GetMapping("/status/{status}")
    public ResponseEntity<List<Solicitacao>> buscarPorStatus(@PathVariable Integer status) {
        List<Solicitacao> lista = solicitacaoService.buscarPorStatus(status);
        if (lista.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(lista);
    }

    // Deletar solicitação
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        boolean deletado = solicitacaoService.deletar(id);
        return deletado ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }

// Soft delete de solicitação
    @PutMapping("/{id}/desativar")
    public ResponseEntity<Solicitacao> desativar(@PathVariable Long id) {
        boolean desativado = solicitacaoService.desativar(id);
            if (desativado) {
        // retorna a solicitação desativada
                return solicitacaoService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
            }
        return ResponseEntity.notFound().build();
}
}
