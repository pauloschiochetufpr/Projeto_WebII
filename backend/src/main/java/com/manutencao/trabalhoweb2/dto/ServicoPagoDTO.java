package com.manutencao.trabalhoweb2.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class ServicoPagoDTO {
    
    private Long id;
    private String nomeCliente;
    private String descricaoEquipamento;
    private BigDecimal valor;
    private LocalDateTime dataPagamento;

    public ServicoPagoDTO(Long id, String nomeCliente, String descricaoEquipamento, BigDecimal valor) {
        this.id = id;
        this.nomeCliente = nomeCliente;
        this.descricaoEquipamento = descricaoEquipamento;
        this.valor = valor;
    }
    
    public Long getId() {
    return id;
}
public String getNomeCliente() {
    return nomeCliente;
}
public String getDescricaoEquipamento() {
    return descricaoEquipamento;
}
public BigDecimal getValor() {
    return valor;
}
public LocalDateTime getDataPagamento() {
    return dataPagamento;
}

// Setters (Embora menos cruciais para um DTO de retorno, são boas práticas)
public void setId(Long id) {
    this.id = id;
}
}