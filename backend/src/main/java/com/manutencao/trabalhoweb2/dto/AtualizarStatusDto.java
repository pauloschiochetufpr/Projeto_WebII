package com.manutencao.trabalhoweb2.dto;

import java.math.BigDecimal;

/**
 * DTO usado para alterar status de uma solicitação.
 */
public class AtualizarStatusDto {
    private Integer novoStatus;
    private String motivo;
    private boolean cliente;
    private Integer funcionarioId; // id do funcionário que está fazendo a ação (opcional)
    private BigDecimal valor;      // caso seja orçamento, o valor enviado

    public Integer getNovoStatus() { return novoStatus; }
    public void setNovoStatus(Integer novoStatus) { this.novoStatus = novoStatus; }

    public String getMotivo() { return motivo; }
    public void setMotivo(String motivo) { this.motivo = motivo; }

    public boolean isCliente() { return cliente; }
    public void setCliente(boolean cliente) { this.cliente = cliente; }

    public Integer getFuncionarioId() { return funcionarioId; }
    public void setFuncionarioId(Integer funcionarioId) { this.funcionarioId = funcionarioId; }

    public BigDecimal getValor() { return valor; }
    public void setValor(BigDecimal valor) { this.valor = valor; }
}
