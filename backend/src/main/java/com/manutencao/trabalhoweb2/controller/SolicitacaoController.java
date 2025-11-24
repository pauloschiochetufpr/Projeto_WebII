package com.manutencao.trabalhoweb2.controller;

import com.manutencao.trabalhoweb2.dto.AtualizarStatusDto;
import com.manutencao.trabalhoweb2.dto.SolicitacaoCreateDto;
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

import java.time.format.DateTimeFormatter;
import java.util.*;

@RestController
@RequestMapping("/api/solicitacoes")
@CrossOrigin("*")
public class SolicitacaoController {

    @Autowired
    private SolicitacaoService solicitacaoService;

    private static final DateTimeFormatter ISO = DateTimeFormatter.ISO_DATE_TIME;

    // =======================================================
    // MAP STATUS → TEXTO
    // =======================================================

    private String mapStatus(Integer idStatus) {
        if (idStatus == null) return "DESCONHECIDO";
        return switch (idStatus) {
            case 1 -> "ABERTA";
            case 2 -> "ORÇADA";
            case 3 -> "APROVADA";
            case 4 -> "REJEITADA";
            case 5 -> "ARRUMADA";
            case 6 -> "PAGA";
            case 7 -> "FINALIZADA";
            case 8 -> "REDIRECIONADA";
            default -> "DESCONHECIDO";
        };
    }

    // =======================================================
    // LISTAR TODAS RAW
    // =======================================================

    @GetMapping("/")
    public ResponseEntity<List<Solicitacao>> listarTodas() {
        return ResponseEntity.ok(solicitacaoService.listarTodasRaw());
    }

    // =======================================================
    // BUSCAR POR ID
    // =======================================================

    @GetMapping("/{id}")
    public ResponseEntity<SolicitacaoResponseDto> buscarPorId(@PathVariable Long id) {
        return solicitacaoService.buscarPorId(id)
                .map(s -> ResponseEntity.ok(solicitacaoService.toDto(s)))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/funcionario/abertas")
    public ResponseEntity<List<SolicitacaoLastUpdateDto>> listarAbertasParaFuncionario() {
    List<SolicitacaoLastUpdateDto> list = solicitacaoService.listarAbertasParaFuncionario();
    return ResponseEntity.ok(list);
}


    @GetMapping("/funcionario/{id}/minhas")
    public ResponseEntity<List<Solicitacao>> listarSomenteFuncionario(@PathVariable Long id) {

    List<Solicitacao> lista = solicitacaoService.listarSomenteDoFuncionario(id);

    if (lista.isEmpty()) return ResponseEntity.noContent().build();

    return ResponseEntity.ok(lista);
}



    // =======================================================
    // BUSCAR POR STATUS
    // =======================================================

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Solicitacao>> buscarPorStatus(@PathVariable Integer status) {
        return ResponseEntity.ok(solicitacaoService.buscarPorStatus(status));
    }

    // =======================================================
    // LISTAR POR CLIENTE COM LAST UPDATE
    // =======================================================

    @GetMapping("/cliente/{id}/with-last-update")
    public ResponseEntity<List<Map<String, Object>>> listarPorCliente(@PathVariable Long id) {
        List<SolicitacaoLastUpdateDto> lista = solicitacaoService.listarPorCliente(id);

        if (lista.isEmpty()) return ResponseEntity.noContent().build();

        return ResponseEntity.ok(convertToFront(lista));
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
            m.put("ultimoStatus", List.of(ultimo));


            return m;
        }).toList();

        return ResponseEntity.ok(resposta);
    }

    // =======================================================
    // LISTAR TODAS COM LAST UPDATE
    // =======================================================

    @GetMapping("/with-last-update")
    public ResponseEntity<List<Map<String, Object>>> listarComLastUpdate() {
        return ResponseEntity.ok(convertToFront(
                solicitacaoService.listarTodasComUltimoHistorico()
        ));
    }

    // =======================================================
    // CONVERSOR DTO → FORMATO ACEITO PELO ANGULAR
    // =======================================================

    private List<Map<String, Object>> convertToFront(List<SolicitacaoLastUpdateDto> lista) {

        List<Map<String, Object>> resp = new ArrayList<>();

        for (SolicitacaoLastUpdateDto dto : lista) {

            Map<String, Object> m = new HashMap<>();

            m.put("idSolicitacao", dto.idSolicitacao());
            m.put("id", dto.idSolicitacao());

            m.put("nome", dto.nome());
            m.put("descricao", dto.descricao());
            m.put("valor", dto.valor());

            m.put("idStatus", dto.idStatus());
            m.put("state", mapStatus(dto.idStatus()));

            m.put("idCategoria", dto.idCategoria());
            m.put("ativo", dto.ativo());

            m.put("lastUpdate", dto.lastUpdate());
            m.put("createdAt", dto.createdAt());

            m.put("idCliente", dto.idCliente());

            // Cliente
            Map<String, Object> cliente = new HashMap<>();
            cliente.put("id", dto.idCliente());
            cliente.put("nome", dto.nomeCliente());
            m.put("cliente", cliente);

            // Último registro de histórico (sempre como array)
            List<Map<String, Object>> hist = new ArrayList<>();

            Map<String, Object> h = new HashMap<>();
            h.put("statusOld", dto.statusOld());
            h.put("statusNew", dto.statusNew());
            h.put("funcionarioOld", dto.funcionarioOld());
            h.put("funcionarioNew", dto.funcionarioNew());
            hist.add(h);

            m.put("ultimoStatus", hist);

            m.put("redirectDestinationName", "-");

            resp.add(m);
        }

        return resp;
    }

    // =======================================================
    // CRIAR SOLICITAÇÃO
    // =======================================================

    @PostMapping
    public ResponseEntity<?> criar(@RequestBody SolicitacaoDto dto) {
    try {
        Solicitacao nova = solicitacaoService.criar(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(nova);
    } catch (Exception e) {
        e.printStackTrace();
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
    }
}


    private Integer mapCategoria(String nome) {
        if (nome == null) return 0;
        return switch (nome.toLowerCase()) {
            case "notebook" -> 1;
            case "desktop" -> 2;
            case "impressora" -> 3;
            case "mouse" -> 4;
            case "teclado" -> 5;
            default -> 0;
        };
    }

    // =======================================================
    // ATUALIZAR SOLICITAÇÃO (PUT COMPLETO)
    // =======================================================

    @PutMapping("/{id}")
    public ResponseEntity<?> atualizar(
            @PathVariable Long id,
            @RequestBody SolicitacaoDto dto
    ) {
        try {
            return ResponseEntity.ok(solicitacaoService.atualizar(id, dto));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }

    // =======================================================
    // ATUALIZAR STATUS / HISTÓRICO
    // =======================================================

      @PatchMapping("/{id}/status")
    public ResponseEntity<?> atualizarStatus(
            @PathVariable Long id,
            @RequestBody AtualizarStatusDto dto) {
        try {
            Solicitacao s = solicitacaoService.atualizarStatus(id, dto);
            return ResponseEntity.ok(solicitacaoService.toDto(s));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    // =======================================================
    // SOFT DELETE
    // =======================================================

    @PutMapping("/{id}/desativar")
    public ResponseEntity<?> desativar(@PathVariable Long id) {
        try {
            solicitacaoService.desativar(id);
            return ResponseEntity.noContent().build();
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }

    // =======================================================
    // DELETE DEFINITIVO
    // =======================================================

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletar(@PathVariable Long id) {
        solicitacaoService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
