package com.manutencao.trabalhoweb2.model;

import jakarta.persistence.*;

@Entity
@Table(name = "solicitacao")
public class Solicitacao {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idSolicitacao")
    private Long idSolicitacao;

    @Column(name = "nome", nullable = false)
    private String nome;

    @Column(name = "descricao", nullable = false)
    private String descricao;

    @Column(name = "valor", nullable = false)
    private Double valor;

    @Column(name = "ativo", nullable = false)
    private Boolean ativo = true;

    // Foreign key para Usuario
    @ManyToOne
    @JoinColumn(name = "idUsuario", nullable = false)
    private Usuario usuario;

    // Foreign key para Categoria (descomentar quando tivermos a entidade Categoria)
    //@ManyToOne
    //@JoinColumn(name = "idCategoria", nullable = false)
    //private Categoria categoria;
    @Column(name = "idCategoria", nullable = false)
    private Integer idCategoria;

    // Foreign key para Status (sem join pois não temos a entidade Status)
    @Column(name = "idStatus", nullable = false)
    private Integer idStatus;

    protected Solicitacao() {}

    public Solicitacao(String nome, String descricao, Double valor, Usuario usuario, Integer idCategoria, Integer idStatus) {
        this.nome = nome;
        this.descricao = descricao;
        this.valor = valor;
        this.usuario = usuario;
        this.idCategoria = idCategoria;
        this.idStatus = idStatus;
    }

    public Long getIdSolicitacao() {
        return idSolicitacao;
    }

    public void setIdSolicitacao(Long idSolicitacao) {
        this.idSolicitacao = idSolicitacao;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public Double getValor() {
        return valor;
    }

    public void setValor(Double valor) {
        this.valor = valor;
    }

    public Boolean getAtivo() {
        return ativo;
    }

    public void setAtivo(Boolean ativo) {
        this.ativo = ativo;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public Integer getIdCategoria() {
        return idCategoria;
    }

    public void setIdCategoria(Integer idCategoria) {
        this.idCategoria = idCategoria;
    }

    public Integer getIdStatus() {
        return idStatus;
    }

    public void setIdStatus(Integer idStatus) {
        this.idStatus = idStatus;
    }
}
