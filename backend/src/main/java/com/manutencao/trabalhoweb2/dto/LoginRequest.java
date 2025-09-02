package com.manutencao.trabalhoweb2.dto;

public record LoginRequest(
    String email,
    String password
) {}