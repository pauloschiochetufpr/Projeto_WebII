package com.manutencao.trabalhoweb2.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "token_blacklist")
public class TokenBlacklist {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_token_blacklist")
    private Long id;

    @Column(nullable = false, unique = true, length = 512)
    private String token;

    @Column(name = "data_expiracao", nullable = false)
    private LocalDateTime dataExpiracao;

    @Column(nullable = false)
    private Boolean revogado = false;

    public TokenBlacklist() {}

    public TokenBlacklist(String token, LocalDateTime dataExpiracao) {
        this.token = token;
        this.dataExpiracao = dataExpiracao;
        this.revogado = false;
    }

    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public LocalDateTime getDataExpiracao() { return dataExpiracao; }
    public void setDataExpiracao(LocalDateTime dataExpiracao) { this.dataExpiracao = dataExpiracao; }

    public Boolean getRevogado() { return revogado; }
    public void setRevogado(Boolean revogado) { this.revogado = revogado; }
}
