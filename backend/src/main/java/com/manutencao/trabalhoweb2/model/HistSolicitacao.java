package com.manutencao.trabalhoweb2.model;

import java.time.LocalDateTime;

import jakarta.persistence.*;

@Entity
@Table(name = "HistSolicitacao")
public class HistSolicitacao {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idHistorico")
    private Long idHistorico;

    @Column(name = "dataHora", columnDefinition = "TIMESTAMP")
    private LocalDateTime dataHora;

    @ManyToOne
    @JoinColumn(name = "idSolicitacao", nullable = false)
    private Solicitacao solicitacao;

    @Column(name = "Cliente")
    private Boolean cliente;

    @Column(name = "StatusOld")
    private String statusOld;

    @Column(name = "StatusNew")
    private String statusNew;

    @Column(name = "funcionarioOld")
    private Long funcionarioOld;

    @Column(name = "funcionarioNew")
    private Long funcionarioNew;

    protected HistSolicitacao() {}

    public HistSolicitacao(LocalDateTime dataHora, Solicitacao solicitacao, Boolean cliente, String statusOld,
            String statusNew, Long funcionarioOld, Long funcionarioNew) {
        this.dataHora = dataHora;
        this.solicitacao = solicitacao;
        this.cliente = cliente;
        this.statusOld = statusOld;
        this.statusNew = statusNew;
        this.funcionarioOld = funcionarioOld;
        this.funcionarioNew = funcionarioNew;
    }

    public Long getIdHistorico() {
        return idHistorico;
    }

    public void setIdHistorico(Long idHistorico) {
        this.idHistorico = idHistorico;
    }

    public LocalDateTime getDataHora() {
        return dataHora;
    }

    public void setDataHora(LocalDateTime dataHora) {
        this.dataHora = dataHora;
    }

    public Solicitacao getSolicitacao() {
        return solicitacao;
    }

    public void setSolicitacao(Solicitacao solicitacao) {
        this.solicitacao = solicitacao;
    }

    public Boolean getCliente() {
        return cliente;
    }

    public void setCliente(Boolean cliente) {
        this.cliente = cliente;
    }

    public String getStatusOld() {
        return statusOld;
    }

    public void setStatusOld(String statusOld) {
        this.statusOld = statusOld;
    }

    public String getStatusNew() {
        return statusNew;
    }

    public void setStatusNew(String statusNew) {
        this.statusNew = statusNew;
    }

    public Long getFuncionarioOld() {
        return funcionarioOld;
    }

    public void setFuncionarioOld(Long funcionarioOld) {
        this.funcionarioOld = funcionarioOld;
    }

    public Long getFuncionarioNew() {
        return funcionarioNew;
    }

    public void setFuncionarioNew(Long funcionarioNew) {
        this.funcionarioNew = funcionarioNew;
    }
    
}
