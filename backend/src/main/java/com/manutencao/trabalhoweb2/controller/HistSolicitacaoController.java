package com.manutencao.trabalhoweb2.controller;

import com.manutencao.trabalhoweb2.dto.HistSolicitacaoDto;
import com.manutencao.trabalhoweb2.model.HistSolicitacao;
import com.manutencao.trabalhoweb2.service.HistSolicitacaoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/solicitacoes")
@CrossOrigin("*")
public class HistSolicitacaoController {

    private final HistSolicitacaoService histService;

    public HistSolicitacaoController(HistSolicitacaoService histService) {
        this.histService = histService;
    }

    @GetMapping("/{id}/historico")
    public ResponseEntity<List<HistSolicitacaoDto>> getHistoricoBySolicitacao(@PathVariable("id") Long id) {
        List<HistSolicitacao> lista = histService.getHistoricoPorSolicitacaoId(id);

        if (lista.isEmpty()) {
            return ResponseEntity.noContent().build(); 
        }

        // Converte para DTO
    List<HistSolicitacaoDto> dtoList = lista.stream()
        .map(h -> new HistSolicitacaoDto(
            h.getIdHistorico(),
            h.getSolicitacao() != null ? h.getSolicitacao().getIdSolicitacao() : null,
            h.getCliente(),
            h.getStatusOld(),
            h.getStatusNew(),
            h.getFuncionarioOld(),
            h.getFuncionarioNew(),
            h.getDataHora(),
            h.getMotivo()
        ))
        .toList();

        return ResponseEntity.ok(dtoList);
    }
}
