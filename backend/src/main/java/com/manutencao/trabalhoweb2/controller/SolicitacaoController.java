package com.manutencao.trabalhoweb2.controller;

import com.manutencao.trabalhoweb2.dto.SolicitacaoDto;
import com.manutencao.trabalhoweb2.dto.SolicitacaoLastUpdateDto;
import com.manutencao.trabalhoweb2.model.Solicitacao;
import com.manutencao.trabalhoweb2.service.SolicitacaoService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/solicitacoes")
@CrossOrigin("*")
public class SolicitacaoController {

    @Autowired
    private SolicitacaoService solicitacaoService;

    @GetMapping
    public ResponseEntity<List<Solicitacao>> listarTodas() {
        return ResponseEntity.ok(solicitacaoService.listarTodas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Solicitacao> buscarPorId(@PathVariable Long id) {
        return solicitacaoService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Solicitacao>> buscarPorStatus(@PathVariable Integer status) {
        return ResponseEntity.ok(solicitacaoService.buscarPorStatus(status));
    }

    @GetMapping("/with-last-update")
    public ResponseEntity<List<SolicitacaoLastUpdateDto>> listarComLastUpdate() {
        List<SolicitacaoLastUpdateDto> lista = solicitacaoService.listarTodasComLastUpdate();
        return ResponseEntity.ok(lista);
    }


    @PostMapping
    public ResponseEntity<?> criar(@RequestBody SolicitacaoDto dto) {
        try {
            Solicitacao nova = solicitacaoService.criar(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(nova);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> atualizar(@PathVariable Long id, @RequestBody SolicitacaoDto dto) {
        try {
            Solicitacao atualizada = solicitacaoService.atualizar(id, dto);
            return ResponseEntity.ok(atualizada);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<?> atualizarStatus(@PathVariable Long id, @RequestParam Integer novoStatus) {
        try {
            Solicitacao s = solicitacaoService.atualizarStatus(id, novoStatus);
            return ResponseEntity.ok(s);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
    //soft delete
    @PutMapping("/{id}/desativar")
    public ResponseEntity<?> desativar(@PathVariable Long id) {
        try {
            solicitacaoService.desativar(id);
            return ResponseEntity.noContent().build();
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletar(@PathVariable Long id) {
        solicitacaoService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
