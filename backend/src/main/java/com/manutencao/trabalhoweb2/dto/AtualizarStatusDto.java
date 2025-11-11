package com.manutencao.trabalhoweb2.dto;

//dto criado para armazenar temporariamente os dados na hora de atualizar o status que vai pra tabela de historico
public class AtualizarStatusDto {
    private Integer novoStatus;
    private String motivo;
    private boolean cliente;

    public Integer getNovoStatus() { return novoStatus; }
    public void setNovoStatus(Integer novoStatus) { this.novoStatus = novoStatus; }

    public String getMotivo() { return motivo; }
    public void setMotivo(String motivo) { this.motivo = motivo; }

    public boolean isCliente() { return cliente; }
    public void setCliente(boolean cliente) { this.cliente = cliente; }
}
