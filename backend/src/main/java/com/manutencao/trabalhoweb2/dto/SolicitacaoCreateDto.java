package com.manutencao.trabalhoweb2.dto;

public class SolicitacaoCreateDto {
    private String descricaoEquipamento;
    private String categoriaEquipamento;
    private String descricaoDefeito;

    // getters / setters
    public String getDescricaoEquipamento() { return descricaoEquipamento; }
    public void setDescricaoEquipamento(String descricaoEquipamento) { this.descricaoEquipamento = descricaoEquipamento; }

    public String getCategoriaEquipamento() { return categoriaEquipamento; }
    public void setCategoriaEquipamento(String categoriaEquipamento) { this.categoriaEquipamento = categoriaEquipamento; }

    public String getDescricaoDefeito() { return descricaoDefeito; }
    public void setDescricaoDefeito(String descricaoDefeito) { this.descricaoDefeito = descricaoDefeito; }
}

