package com.manutencao.trabalhoweb2.controller;

import com.manutencao.trabalhoweb2.service.RelatorioReceitaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/reports")
public class RelatorioReceitaController {

    @Autowired
    private RelatorioReceitaService relatorioReceitaService;

    @GetMapping("/revenue-by-period/pdf")
    public ResponseEntity<byte[]> gerarRelatorioReceitasPDF(
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate startDate,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate endDate) {

        byte[] pdfBytes = relatorioReceitaService.gerarRelatorioPDF(startDate, endDate);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDisposition(
                ContentDisposition.attachment().filename("relatorio_receitas.pdf").build()
        );

        return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
    }
}
