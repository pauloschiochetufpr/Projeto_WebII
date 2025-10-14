package com.manutencao.trabalhoweb2.dto;


public class ReceitaPorCategoriaDTO {
    
    private String categoria;
    private double receitaTotal;
    private long quantidade;

    public ReceitaPorCategoriaDTO(String categoria, Double receitaTotal, Long quantidade) {
        this.categoria = categoria;
        this.receitaTotal = receitaTotal != null ? receitaTotal : 0.0;
        this.quantidade = quantidade != null ? quantidade : 0L;
    }

}