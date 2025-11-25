package com.manutencao.trabalhoweb2.dto;

public class CategoriaDto {
    private Integer id;
    private String nome;
    private Boolean ativo;

    public CategoriaDto() {}

    public CategoriaDto(Integer id, String nome, Boolean ativo) {
        this.id = id;
        this.nome = nome;
        this.ativo = ativo;
    }

    public Integer getId() {  // <-- CORRIGIDO
        return id;
    }
    public void setId(Integer id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }
    public void setNome(String nome) {
        this.nome = nome;
    }

    public Boolean getAtivo() {
        return ativo;
    }
    public void setAtivo(Boolean ativo) {
        this.ativo = ativo;
    }
}
