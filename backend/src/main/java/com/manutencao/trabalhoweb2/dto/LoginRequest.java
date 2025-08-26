package com.manutencao.trabalhoweb2.dto;

public class LoginRequest {
    private String email;
    private String password;

    public LoginRequest() {}

    // Getter e Setter abaixo (controle de dados, adoro isso ;) )
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

}
