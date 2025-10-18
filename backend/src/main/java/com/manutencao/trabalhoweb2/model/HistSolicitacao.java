package com.manutencao.trabalhoweb2.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "HistSolicitacao")
public class HistSolicitacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idHistorico")
    private Long idHistorico;

    // timestamp no DB tem DEFAULT CURRENT_TIMESTAMP
    @Column(name = "dataHora", insertable = false, updatable = false)
    private LocalDateTime dataHora;

    // relacionamento com solicitacao: idSolicitacao
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idSolicitacao", referencedColumnName = "idSolicitacao", nullable = false)
    private Solicitacao solicitacao;

    @Column(name = "cliente")
    private Boolean cliente;

    @Column(name = "statusOld", length = 32)
    private String statusOld;

    @Column(name = "statusNew", length = 32)
    private String statusNew;

    @Column(name = "funcionarioOld")
    private Integer funcionarioOld;

    @Column(name = "funcionarioNew")
    private Integer funcionarioNew;

    public HistSolicitacao() {}

    // getters / setters
    public Long getIdHistorico() { return idHistorico; }
    public void setIdHistorico(Long idHistorico) { this.idHistorico = idHistorico; }

    public LocalDateTime getDataHora() { return dataHora; }
    public void setDataHora(LocalDateTime dataHora) { this.dataHora = dataHora; }

    public Solicitacao getSolicitacao() { return solicitacao; }
    public void setSolicitacao(Solicitacao solicitacao) { this.solicitacao = solicitacao; }

    public Boolean getCliente() { return cliente; }
    public void setCliente(Boolean cliente) { this.cliente = cliente; }

    public String getStatusOld() { return statusOld; }
    public void setStatusOld(String statusOld) { this.statusOld = statusOld; }

    public String getStatusNew() { return statusNew; }
    public void setStatusNew(String statusNew) { this.statusNew = statusNew; }

    public Integer getFuncionarioOld() { return funcionarioOld; }
    public void setFuncionarioOld(Integer funcionarioOld) { this.funcionarioOld = funcionarioOld; }

    public Integer getFuncionarioNew() { return funcionarioNew; }
    public void setFuncionarioNew(Integer funcionarioNew) { this.funcionarioNew = funcionarioNew; }
}
