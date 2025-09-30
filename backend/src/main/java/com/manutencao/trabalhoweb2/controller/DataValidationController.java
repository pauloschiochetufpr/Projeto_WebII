package com.manutencao.trabalhoweb2.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import org.springframework.http.ResponseEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

import com.manutencao.trabalhoweb2.dto.CepResponse;
import com.manutencao.trabalhoweb2.repository.DDDRepository;
import com.manutencao.trabalhoweb2.service.CepService;
import com.manutencao.trabalhoweb2.service.EmailValidationService;

@RestController
@RequestMapping("/api") //prefixo das chamadas
public class DataValidationController {

    @Autowired
    private DDDRepository dddRepository;

    private final CepService cepService;
    private final EmailValidationService emailValidationService;

    public DataValidationController(CepService cepService,
                                    EmailValidationService emailValidationService) {
        this.cepService = cepService;
        this.emailValidationService = emailValidationService;
    }


    @GetMapping("/validate-email")
    public ResponseEntity<Boolean> validateEmail(@RequestParam String email) {
        try {
            boolean valido = emailValidationService.validarEmail(email);
            return ResponseEntity.ok(valido);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(false);
        }
    }

    @GetMapping("/validate-phone")
    public ResponseEntity<Map<String, Boolean>> validatePhone(@RequestParam String telefone) {
        try {

            String apenasNumeros = telefone.replaceAll("\\D", "");

            if (apenasNumeros.length() < 10 || apenasNumeros.length() > 11) {
                return ResponseEntity.ok(Map.of("valido", false));
            }

            String ddd = apenasNumeros.substring(0, apenasNumeros.length() - 9);

            boolean valido = dddRepository.existsByDdd(ddd);

            return ResponseEntity.ok(Map.of("valido", valido));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("valido", false));
        }
    }
    
    @GetMapping("/validate-cep")
    public CompletableFuture<ResponseEntity<CepResponse>> validarCep(@RequestParam String cep) {
        return cepService.validarCep(cep)
                .thenApply(ResponseEntity::ok);
    }

}
