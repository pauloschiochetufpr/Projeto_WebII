package com.manutencao.trabalhoweb2.controller;

import com.manutencao.trabalhoweb2.dto.AtualizarStatusDto;
import com.manutencao.trabalhoweb2.dto.SolicitacaoDto;
import com.manutencao.trabalhoweb2.dto.SolicitacaoLastUpdateDto;
import com.manutencao.trabalhoweb2.dto.SolicitacaoResponseDto;
import com.manutencao.trabalhoweb2.model.Solicitacao;
import com.manutencao.trabalhoweb2.service.SolicitacaoService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping("api/solicitacoes")
@CrossOrigin("*")
public class SolicitacaoController {

    @Autowired
    private SolicitacaoService solicitacaoService;

    @GetMapping("/")
    public ResponseEntity<List<SolicitacaoResponseDto>> listarTodas() {
    List<SolicitacaoResponseDto> dtos = solicitacaoService.listarTodas()
            .stream()
            .map(solicitacaoService::toDto)
            .collect(Collectors.toList());
    return ResponseEntity.ok(dtos);
    } 

    @GetMapping("/{id}")
    public ResponseEntity<SolicitacaoResponseDto> buscarPorId(@PathVariable Long id) {
    return solicitacaoService.buscarPorId(id)
            .map(s -> ResponseEntity.ok(solicitacaoService.toDto(s)))
            .orElse(ResponseEntity.notFound().build());
}

    @GetMapping("/status/{status}")
     public ResponseEntity<List<SolicitacaoResponseDto>> buscarPorStatus(@PathVariable Integer status) {
        List<SolicitacaoResponseDto> dtos = solicitacaoService.buscarPorStatus(status)
                .stream()
                .map(solicitacaoService::toDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/cliente/{id}/with-last-update")
public ResponseEntity<List<Map<String, Object>>> listarPorClienteComLastUpdate(@PathVariable("id") Long clienteId) {
    List<SolicitacaoLastUpdateDto> lista = solicitacaoService.listarPorClienteComLastUpdate(clienteId);

    if (lista.isEmpty()) {
        return ResponseEntity.noContent().build();
    }

    List<Map<String, Object>> resposta = lista.stream().map(dto -> {
        Map<String, Object> m = new HashMap<>();
        m.put("idSolicitacao", dto.idSolicitacao());
        m.put("nome", dto.nome());
        m.put("descricao", dto.descricao());
        m.put("valor", dto.valor());
        m.put("idStatus", dto.idStatus());
        m.put("idCategoria", dto.idCategoria());
        m.put("ativo", dto.ativo());
        m.put("lastUpdate", dto.lastUpdate());
        m.put("idCliente", dto.idCliente());

        Map<String, Object> cliente = new HashMap<>();
        cliente.put("id", dto.idCliente());
        cliente.put("nome", dto.nomeCliente());
        m.put("cliente", cliente);

        Map<String, Object> ultimo = new HashMap<>();
        ultimo.put("statusOld", dto.statusOld());
        ultimo.put("statusNew", dto.statusNew());
        ultimo.put("funcionarioOld", dto.funcionarioOld());
        ultimo.put("funcionarioNew", dto.funcionarioNew());
        m.put("ultimoStatus", ultimo);

        return m;
    }).toList();

    return ResponseEntity.ok(resposta);
}

    @GetMapping("/with-last-update")
public ResponseEntity<List<Map<String, Object>>> listarComLastUpdate() {
    List<SolicitacaoLastUpdateDto> lista = solicitacaoService.listarTodasComUltimoHistorico();

    // monta o dto
    List<Map<String, Object>> resposta = lista.stream().map(dto -> {
        Map<String, Object> m = new HashMap<>();
        m.put("idSolicitacao", dto.idSolicitacao());
        m.put("nome", dto.nome());
        m.put("descricao", dto.descricao());
        m.put("valor", dto.valor());
        m.put("idStatus", dto.idStatus());
        m.put("idCategoria", dto.idCategoria());
        m.put("ativo", dto.ativo());
        m.put("lastUpdate", dto.lastUpdate());
        m.put("idCliente", dto.idCliente());

        Map<String, Object> cliente = new HashMap<>();
        cliente.put("id", dto.idCliente());
        cliente.put("nome", dto.nomeCliente());
        m.put("cliente", cliente);

        Map<String, Object> ultimo = new HashMap<>();
        ultimo.put("statusOld", dto.statusOld());
        ultimo.put("statusNew", dto.statusNew());
        ultimo.put("funcionarioOld", dto.funcionarioOld());
        ultimo.put("funcionarioNew", dto.funcionarioNew());
        m.put("ultimoStatus", ultimo);

        return m;
    }).toList();

    return ResponseEntity.ok(resposta);
}

@GetMapping("/funcionario/{id}/with-last-update")
public ResponseEntity<List<Map<String, Object>>> listarPorFuncionarioComLastUpdate(
        @PathVariable("id") Long funcionarioId) {

    List<SolicitacaoLastUpdateDto> lista = solicitacaoService.listarPorFuncionarioComLastUpdate(funcionarioId);

    if (lista == null || lista.isEmpty()) {
        return ResponseEntity.noContent().build();
    }

    List<Map<String, Object>> resposta = lista.stream().map(dto -> {
        Map<String, Object> m = new HashMap<>();
        m.put("idSolicitacao", dto.idSolicitacao());
        m.put("nome", dto.nome());
        m.put("descricao", dto.descricao());
        m.put("valor", dto.valor());
        m.put("idStatus", dto.idStatus());
        m.put("idCategoria", dto.idCategoria());
        m.put("ativo", dto.ativo());
        m.put("lastUpdate", dto.lastUpdate());
        m.put("idCliente", dto.idCliente());

        Map<String, Object> cliente = new HashMap<>();
        cliente.put("id", dto.idCliente());
        cliente.put("nome", dto.nomeCliente());
        m.put("cliente", cliente);

        Map<String, Object> ultimo = new HashMap<>();
        ultimo.put("statusOld", dto.statusOld());
        ultimo.put("statusNew", dto.statusNew());
        ultimo.put("funcionarioOld", dto.funcionarioOld());
        ultimo.put("funcionarioNew", dto.funcionarioNew());
        m.put("ultimoStatus", ultimo);

        return m;
    }).toList();

    return ResponseEntity.ok(resposta);
}


    @PostMapping
public ResponseEntity<?> criar(@RequestBody SolicitacaoDto dto) {
    try {
        Solicitacao nova = solicitacaoService.criar(dto);
        // retorna DTO em vez da entidade
        return ResponseEntity.status(HttpStatus.CREATED).body(solicitacaoService.toDto(nova));
    } catch (EntityNotFoundException e) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
    }
}

    @PutMapping("/{id}")
public ResponseEntity<?> atualizar(@PathVariable Long id, @RequestBody SolicitacaoDto dto) {
    try {
        Solicitacao atualizada = solicitacaoService.atualizar(id, dto);
        // retorna DTO
        return ResponseEntity.ok(solicitacaoService.toDto(atualizada));
    } catch (EntityNotFoundException e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
    }
}

    
    @PatchMapping("/{id}/status")
public ResponseEntity<?> atualizarStatus(
    @PathVariable Long id,
    @RequestBody AtualizarStatusDto dto) {
    try {
        Solicitacao s = solicitacaoService.atualizarStatus(id, dto);
        // retorna DTO
        return ResponseEntity.ok(solicitacaoService.toDto(s));
    } catch (EntityNotFoundException e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
    } catch (IllegalArgumentException e) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Status inválido: " + e.getMessage());
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
