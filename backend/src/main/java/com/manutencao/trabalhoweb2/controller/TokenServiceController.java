package com.manutencao.trabalhoweb2.controller;

import org.springframework.web.bind.annotation.*;
import com.manutencao.trabalhoweb2.dto.*;
import com.manutencao.trabalhoweb2.service.TokenAdminService;

import org.springframework.http.ResponseEntity;
import java.util.Map;

@RestController
@RequestMapping("/api/token")
public class TokenServiceController {
    private final TokenAdminService tokenAdmin;

    public TokenServiceController(TokenAdminService tokenAdmin) {
        this.tokenAdmin = tokenAdmin;
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> tokenRotation(@RequestBody Map<String, String> body) {
        String refreshToken = body.get("refreshToken");
        String accessToken = body.get("accessToken");

        AuthResponse response = tokenAdmin.tokenRotation(refreshToken, accessToken);

        // Caso o código de retorno seja diferente de 200
        if (response.getCode() != 200) {
            return ResponseEntity.status(response.getCode()).body(response);
        }

        return ResponseEntity.ok(response);
    }

}
