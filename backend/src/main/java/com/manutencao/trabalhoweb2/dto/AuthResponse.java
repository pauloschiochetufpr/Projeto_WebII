package com.manutencao.trabalhoweb2.dto;

public class AuthResponse extends BasicResponse {
    public String accessToken;
    public String refreshToken;


    // Eu sei que cookies http only é mais seguro, mas não é cobrado nas diretrizes e estamos sem tempo ;)
    public AuthResponse(String accessToken, String refreshToken) {
        super(200, "Login realizado com sucesso");
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
    }

    public AuthResponse(int codigo, String mensagem) {
        super(codigo, mensagem);
    }
}
