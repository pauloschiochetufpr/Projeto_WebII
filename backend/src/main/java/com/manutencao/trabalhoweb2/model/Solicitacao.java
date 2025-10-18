package com.manutencao.trabalhoweb2.model;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "solicitacao")
public class Solicitacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idSolicitacao")
    private Long idSolicitacao;

    @Column(name = "nome", nullable = false, length = 64)
    private String nome;

    @Column(name = "descricao", nullable = false, length = 255)
    private String descricao;

    // relacionamento com cliente (idCliente). Nullable conforme DDL.
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idCliente", referencedColumnName = "idCliente", nullable = true)
    private Cliente cliente;

    // valor com precisão DECIMAL(10,2)
    @Column(name = "valor", precision = 10, scale = 2)
    private BigDecimal valor;

    @Column(name = "idStatus", nullable = false)
    private Integer idStatus;

    @Column(name = "idCategoria", nullable = false)
    private Integer idCategoria;

    @Column(name = "ativo")
    private Boolean ativo = Boolean.TRUE;

    protected Solicitacao() {}

    protected Solicitacao(String nome, String descricao, Cliente cliente, BigDecimal valor, Integer idStatus, Integer idCategoria) {
        this.nome = nome;
        this.descricao = descricao;
        this.cliente = cliente;
        this.valor = valor;
        this.idStatus = idStatus;
        this.idCategoria = idCategoria;
        this.ativo = true;
    }

    // getters / setters
    public Long getIdSolicitacao() { return idSolicitacao; }
    public void setIdSolicitacao(Long idSolicitacao) { this.idSolicitacao = idSolicitacao; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }

    public Cliente getCliente() { return cliente; }
    public void setCliente(Cliente cliente) { this.cliente = cliente; }

    public BigDecimal getValor() { return valor; }
    public void setValor(BigDecimal valor) { this.valor = valor; }

    public Integer getIdStatus() { return idStatus; }
    public void setIdStatus(Integer idStatus) { this.idStatus = idStatus; }

    public Integer getIdCategoria() { return idCategoria; }
    public void setIdCategoria(Integer idCategoria) { this.idCategoria = idCategoria; }

    public Boolean getAtivo() { return ativo; }
    public void setAtivo(Boolean ativo) { this.ativo = ativo; }
}