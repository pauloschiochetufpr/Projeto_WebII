package com.manutencao.trabalhoweb2.controller;

import org.springframework.web.bind.annotation.*;
import com.manutencao.trabalhoweb2.dto.*;
import com.manutencao.trabalhoweb2.service.AuthService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/cadastro")
    public ResponseEntity<BasicResponse> registerCliente(@RequestBody RegisterRequest request) {
        BasicResponse response = authService.registerCliente(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        Object result = authService.login(request);

        if (result instanceof BasicResponse basicResponse) {
            return ResponseEntity
                    .status(HttpStatus.valueOf(basicResponse.getCode()))
                    .body(basicResponse);
        }

        if (result instanceof AuthResponse authResponse) {
            return ResponseEntity.ok(authResponse);
        }
        
        // Se passar para cá, ai é fogo
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new BasicResponse(500, "Erro interno inesperado"));
    }

}