package com.manutencao.trabalhoweb2.model;

import java.time.LocalDateTime;

import jakarta.persistence.*;

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

    @Column(name = "valor", nullable = true)
    private Double valor;

    @Column(name = "ativo", nullable = false)
    private Boolean ativo = true;

    // Mapeia o cliente (idCliente) corretamente, substituindo Usuario
    @ManyToOne
    @JoinColumn(name = "idCliente", nullable = true)
    private Cliente cliente;

    @Column(name = "idCategoria", nullable = false)
    private Integer idCategoria;

    @Column(name = "idStatus", nullable = false)
    private Integer idStatus;
    
    private LocalDateTime dataPagamento;

    protected Solicitacao() {}

    public Solicitacao(String nome, String descricao, Double valor, Cliente cliente,
                       Integer idCategoria, Integer idStatus) {
        this.nome = nome;
        this.descricao = descricao;
        this.valor = valor;
        this.cliente = cliente;
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

    public Cliente getCliente() {
        return cliente;
    }

    public void setCliente(Cliente cliente) {
        this.cliente = cliente;
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

    public LocalDateTime getDataPagamento() {
        return dataPagamento;
    }
}
