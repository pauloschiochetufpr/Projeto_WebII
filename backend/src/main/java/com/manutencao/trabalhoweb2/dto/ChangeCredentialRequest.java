package com.manutencao.trabalhoweb2.dto;

public class ChangeCredentialRequest {
    public String email;
    public String senha;
    private String token;

    // Getters e Setters
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getSenha() { return senha; }
    public void setSenha(String senha) {this.senha = senha;}
    
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
}