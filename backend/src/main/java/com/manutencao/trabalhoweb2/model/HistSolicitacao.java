package com.manutencao.trabalhoweb2.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "hist_solicitacao")
public class HistSolicitacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_historico")
    private Long idHistorico;

    // timestamp no DB tem DEFAULT CURRENT_TIMESTAMP
    @Column(name = "data_hora", insertable = false, updatable = false)
    private LocalDateTime dataHora;

    // relacionamento com solicitacao: idSolicitacao
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_solicitacao", referencedColumnName = "id_solicitacao", nullable = false)
    private Solicitacao solicitacao;

    @Column(name = "cliente")
    private Boolean cliente;

    @Column(name = "status_old", length = 32)
    private String statusOld;

    @Column(name = "status_new", length = 32)
    private String statusNew;

    @Column(name = "funcionario_old")
    private Integer funcionarioOld;

    @Column(name = "funcionario_new")
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
