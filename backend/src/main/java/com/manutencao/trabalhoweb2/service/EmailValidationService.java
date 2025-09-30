package com.manutencao.trabalhoweb2.service;

import org.springframework.stereotype.Service;

@Service
public class EmailValidationService {

    public boolean validarEmail(String email) {
        // Retorna sempre verdadeiro
        return true;
    }
}
