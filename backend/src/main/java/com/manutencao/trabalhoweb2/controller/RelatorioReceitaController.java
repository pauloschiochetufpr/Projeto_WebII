package com.manutencao.trabalhoweb2.controller;

import com.manutencao.trabalhoweb2.service.RelatorioReceitaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "*") // Permite acesso do Angular
public class RelatorioReceitaController {
    
    @Autowired
    private RelatorioReceitaService relatorioService;
    
    /**
     * RF019 - Endpoint para gerar relatório de receitas em PDF
     * 
     * Exemplos de uso:
     * GET /api/reports/revenue-by-period
     * GET /api/reports/revenue-by-period?startDate=2024-01-01
     * GET /api/reports/revenue-by-period?startDate=2024-01-01&endDate=2024-12-31
     * 
     * @param startDate Data inicial (opcional, formato: YYYY-MM-DD)
     * @param endDate Data final (opcional, formato: YYYY-MM-DD)
     * @return PDF do relatório
     */
    @GetMapping("/revenue-by-period")
    public ResponseEntity<byte[]> gerarRelatorioReceitas(
            @RequestParam(name = "startDate", required = false) 
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) 
            LocalDate startDate,
            
            @RequestParam(name = "endDate", required = false) 
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) 
            LocalDate endDate) {
        
        try {
            byte[] pdf = relatorioService.gerarRelatorioPDF(startDate, endDate);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", "relatorio-receitas.pdf");
            headers.setContentLength(pdf.length);
            
            return new ResponseEntity<>(pdf, headers, HttpStatus.OK);
            
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(null);
        }
    }
}