package com.manutencao.trabalhoweb2.utils;
import org.springframework.security.crypto.bcrypt.BCrypt;

public class SenhaRandomCriar {

    public static void main(String[] args) {
        String senha = "1234";

        // Gera salt seguro
        String salt = BCrypt.gensalt();

        // Gera hash BCrypt
        String hashSenha = BCrypt.hashpw(senha, salt);

        System.out.println("Senha original: " + senha);
        System.out.println("Salt gerado: " + salt);
        System.out.println("Hash gerado: " + hashSenha);
    }
}
