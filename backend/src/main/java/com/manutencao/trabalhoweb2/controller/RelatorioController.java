// package com.manutencao.trabalhoweb2.controller;

// import com.manutencao.trabalhoweb2.dto.ReceitaPorCategoriaDTO;
// import com.manutencao.trabalhoweb2.dto.ServicoPagoDTO;
// import com.manutencao.trabalhoweb2.service.RelatorioService;

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.format.annotation.DateTimeFormat;
// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.*;

// import java.time.LocalDate;
// import java.util.List;

// @RestController
// @RequestMapping("/api/reports")
// @CrossOrigin(origins = "http://localhost:4200") 
// public class RelatorioController {

//     @Autowired
//     private RelatorioService relatorioService;

//     /**
//      * RF019 - MUDAR O MAPPING!!!!
//      * 
//      */
//     @GetMapping("/revenue-by-period")
//     public ResponseEntity<List<ServicoPagoDTO>> getRevenueByPeriod(
//             @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
//             @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

//         List<ServicoPagoDTO> dadosBrutos = relatorioService.findServicosPagos(startDate, endDate);
        
//         return ResponseEntity.ok(dadosBrutos);
//     }

//     /**
//      * RF020
//      * 
//      */
//     @GetMapping("/revenue-by-category")
//     public ResponseEntity<List<ReceitaPorCategoriaDTO>> getRevenueByCategory() {

//         List<ReceitaPorCategoriaDTO> dadosAgrupados = relatorioService.getRevenueByCategory();

//         return ResponseEntity.ok(dadosAgrupados);
//     }
// }