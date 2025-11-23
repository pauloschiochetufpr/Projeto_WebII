package com.manutencao.trabalhoweb2.controller;

import com.manutencao.trabalhoweb2.dto.ReceitaDiariaDTO;
import com.manutencao.trabalhoweb2.dto.ReceitaPorCategoriaDTO;
import com.manutencao.trabalhoweb2.service.RelatorioReceitaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class RelatorioReceitaController {

    @Autowired
    private RelatorioReceitaService relatorioReceitaService;
    // Receita por período (PDF)
    @GetMapping("/revenue-by-period/pdf")
    public ResponseEntity<byte[]> gerarRelatorioPeriodoPDF(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        byte[] pdfBytes = relatorioReceitaService.gerarRelatorioPeriodoPDF(startDate, endDate);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=receita_periodo.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdfBytes);
    }

    @GetMapping("/revenue-by-category/pdf")
    public ResponseEntity<byte[]> gerarRelatorioCategoriaPDF() {

        byte[] pdfBytes = relatorioReceitaService.gerarRelatorioCategoriaPDF();

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=receita_categoria.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdfBytes);
    }
    // Endpoint JSON para preencher a tela 
    @GetMapping("/revenue-by-period")
    public ResponseEntity<List<ReceitaDiariaDTO>> getReceitaPeriodoJson(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        
        return ResponseEntity.ok(relatorioReceitaService.buscarDadosPeriodo(startDate, endDate));
    }

    // Endpoint porém para categoria
    @GetMapping("/revenue-by-category")
    public ResponseEntity<List<ReceitaPorCategoriaDTO>> getReceitaCategoriaJson() {
        return ResponseEntity.ok(relatorioReceitaService.buscarDadosCategoria());
    }
}