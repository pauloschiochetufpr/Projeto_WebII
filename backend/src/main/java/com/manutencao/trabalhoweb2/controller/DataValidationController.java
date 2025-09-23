package com.manutencao.trabalhoweb2.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.http.ResponseEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import java.util.Map;

import com.manutencao.trabalhoweb2.dto.CepResponse;
import com.manutencao.trabalhoweb2.repository.DDDRepository;
import com.manutencao.trabalhoweb2.service.CepService;

@RestController
@RequestMapping("/api") //prefixo das chamadas
public class DataValidationController {

    private final String API_URL = "https://rapid-email-verifier.fly.dev/api/validate?email=";

    @Autowired
    private DDDRepository dddRepository;

    private final CepService cepService;

    public DataValidationController(CepService cepService) {
        this.cepService = cepService;
    }


    @GetMapping("/validate-email")
    public ResponseEntity<Boolean> validateEmail(@RequestParam String email) {
        try {
            RestTemplate restTemplate = new RestTemplate();
            String url = API_URL + email;

            String response = restTemplate.getForObject(url, String.class);

            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(response);

            String status = root.path("status").asText("");
            if (!"VALID".equalsIgnoreCase(status)) {
                return ResponseEntity.ok(false);
            }

            // Validações principais
            JsonNode validations = root.path("validations");
            boolean syntax = validations.path("syntax").asBoolean(false);
            boolean domainExists = validations.path("domain_exists").asBoolean(false);
            boolean mxRecords = validations.path("mx_records").asBoolean(false);
            boolean mailboxExists = validations.path("mailbox_exists").asBoolean(false);

            boolean isValid = syntax && domainExists && mxRecords && mailboxExists;

            return ResponseEntity.ok(isValid);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(false);
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
    public ResponseEntity<CepResponse> validarCep(@RequestParam String cep) {
        CepResponse dados = cepService.validarCep(cep);
        return ResponseEntity.ok(dados);
    }

}
