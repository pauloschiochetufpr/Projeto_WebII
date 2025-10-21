package com.manutencao.trabalhoweb2.controller;

import org.springframework.web.bind.annotation.*;
import com.manutencao.trabalhoweb2.dto.*;
import com.manutencao.trabalhoweb2.service.AuthService;
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
        AuthResponse resp = authService.login(request);
        if (resp == null || resp.accessToken == null) {
            return ResponseEntity.status(401).body(new BasicResponse(401, "Credenciais inválidas"));
        }
        return ResponseEntity.ok(resp);
    }
}