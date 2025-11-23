package com.manutencao.trabalhoweb2.dto;

import java.math.BigDecimal;

public class ReceitaPorCategoriaDTO {
    
    private String categoria;
    private BigDecimal receitaTotal;
    private Long quantidade;

    public ReceitaPorCategoriaDTO(String categoria, BigDecimal receitaTotal, Long quantidade) {
        this.categoria = categoria;
        this.receitaTotal = receitaTotal != null ? receitaTotal : BigDecimal.ZERO;
        this.quantidade = quantidade != null ? quantidade : 0L;
    }
    public String getCategoria() { return categoria; }
    public void setCategoria(String categoria) { this.categoria = categoria; }

    public BigDecimal getReceitaTotal() { return receitaTotal; }
    public void setReceitaTotal(BigDecimal receitaTotal) { this.receitaTotal = receitaTotal; }

    public Long getQuantidade() { return quantidade; }
    public void setQuantidade(Long quantidade) { this.quantidade = quantidade; }
}