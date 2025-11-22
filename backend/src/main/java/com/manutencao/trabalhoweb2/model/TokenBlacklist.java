package com.manutencao.trabalhoweb2.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "token_blacklist")
public class TokenBlacklist {

    @Id
    @Column(name = "token", length = 512, nullable = false, unique = true)
    private String token;

    @Column(name = "data_expiracao", nullable = false)
    private LocalDateTime dataExpiracao;

    public TokenBlacklist() {}

    public TokenBlacklist(String token, LocalDateTime dataExpiracao) {
        this.token = token;
        this.dataExpiracao = dataExpiracao;
    }

    // Getters e Setters
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public LocalDateTime getDataExpiracao() { return dataExpiracao; }
    public void setDataExpiracao(LocalDateTime dataExpiracao) { this.dataExpiracao = dataExpiracao; }
}
