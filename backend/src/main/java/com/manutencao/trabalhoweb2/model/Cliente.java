package com.manutencao.trabalhoweb2.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "cliente")
public class Cliente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_cliente")
    private Long idCliente;

    @Column(length = 11, nullable = false, unique = true)
    private String cpf;

    @Column(length = 64, nullable = false)
    private String nome;

    @Column(length = 128, nullable = false, unique = true)
    private String email;

    @Column(length = 13, nullable = false)
    private String telefone;

    @Column(name = "senha_hash", length = 64, nullable = false)
    private String senhaHash;

    @Column(nullable = false)
    private Boolean ativo = true;

    @Column(nullable = false)
    private LocalDateTime cadastro = LocalDateTime.now();

    @Column(name = "ultimo_login", nullable = false)
    private LocalDateTime ultimoLogin = LocalDateTime.now();

    @Column(name = "ultima_alteracao", nullable = false)
    private LocalDateTime ultimaAlteracao = LocalDateTime.now();

    public Cliente() {}

    public Cliente(String cpf, String nome, String email, String telefone, String senhaHash) {
        this.cpf = cpf;
        this.nome = nome;
        this.email = email;
        this.telefone = telefone;
        this.senhaHash = senhaHash;
    }

    // Getters e Setters
    public Long getIdCliente() { return idCliente; }
    public void setIdCliente(Long idCliente) { this.idCliente = idCliente; }

    public String getCpf() { return cpf; }
    public void setCpf(String cpf) { this.cpf = cpf; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getTelefone() { return telefone; }
    public void setTelefone(String telefone) { this.telefone = telefone; }

    public String getSenhaHash() { return senhaHash; }
    public void setSenhaHash(String senhaHash) { this.senhaHash = senhaHash; }

    public Boolean getAtivo() { return ativo; }
    public void setAtivo(Boolean ativo) { this.ativo = ativo; }

    public LocalDateTime getCadastro() { return cadastro; }
    public void setCadastro(LocalDateTime cadastro) { this.cadastro = cadastro; }

    public LocalDateTime getUltimoLogin() { return ultimoLogin; }
    public void setUltimoLogin(LocalDateTime ultimoLogin) { this.ultimoLogin = ultimoLogin; }

    public LocalDateTime getUltimaAlteracao() { return ultimaAlteracao; }
    public void setUltimaAlteracao(LocalDateTime ultimaAlteracao) { this.ultimaAlteracao = ultimaAlteracao; }
}
