package com.manutencao.trabalhoweb2.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * DTO para receitas agrupadas por dia
 * 
 */
public class ReceitaDiariaDTO {
    
    private LocalDate data;
    private BigDecimal valorTotal;
    private Long quantidadeSolicitacoes;

    public ReceitaDiariaDTO(LocalDate data, BigDecimal valorTotal, Long quantidadeSolicitacoes) {
        this.data = data;
        this.valorTotal = valorTotal;
        this.quantidadeSolicitacoes = quantidadeSolicitacoes;
    }
    
    // Getters e Setters
    public LocalDate getData() {
        return data;
    }
    
    public void setData(LocalDate data) {
        this.data = data;
    }
    
    public BigDecimal getValorTotal() {
        return valorTotal;
    }
    
    public void setValorTotal(BigDecimal valorTotal) {
        this.valorTotal = valorTotal;
    }
    
    public Long getQuantidadeSolicitacoes() {
        return quantidadeSolicitacoes;
    }
    
    public void setQuantidadeSolicitacoes(Long quantidadeSolicitacoes) {
        this.quantidadeSolicitacoes = quantidadeSolicitacoes;
    }
}