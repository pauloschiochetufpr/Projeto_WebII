package com.manutencao.trabalhoweb2.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "funcionario")
public class Funcionario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_funcionario")
    private Long idFuncionario;

    @Column(length = 64, nullable = false)
    private String nome;

    @Column(length = 128, nullable = false, unique = true)
    private String email;

    @Column(name = "data_nasc", nullable = false)
    private LocalDate dataNasc;

    @Column(length = 13, nullable = false)
    private String telefone;

    @Column(name = "senha_hash", length = 64, nullable = false)
    private String senhaHash;

    @Column(nullable = false)
    private Boolean ativo = true;

    protected Funcionario() {}

    public Funcionario(String nome, String email, LocalDate dataNasc, String telefone, String senhaHash, String salt) {
        this.nome = nome;
        this.email = email;
        this.dataNasc = dataNasc;
        this.telefone = telefone;
        this.senhaHash = senhaHash;
    }

    // Getters e Setters
    public Long getIdFuncionario() { return idFuncionario; }
    public void setIdFuncionario(Long idFuncionario) { this.idFuncionario = idFuncionario; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public LocalDate getDataNasc() { return dataNasc; }
    public void setDataNasc(LocalDate dataNasc) { this.dataNasc = dataNasc; }

    public String getTelefone() { return telefone; }
    public void setTelefone(String telefone) { this.telefone = telefone; }

    public String getSenhaHash() { return senhaHash; }
    public void setSenhaHash(String senhaHash) { this.senhaHash = senhaHash; }

    public Boolean getAtivo() { return ativo; }
    public void setAtivo(Boolean ativo) { this.ativo = ativo; }
}
