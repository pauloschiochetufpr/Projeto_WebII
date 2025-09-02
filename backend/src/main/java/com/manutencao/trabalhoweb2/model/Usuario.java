package com.manutencao.trabalhoweb2.model;

import jakarta.persistence.*;

@Entity
@Table(name = "usuarios")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false, unique = true)
    private String cpf;

    private String cep;
    private String telefone;
    private String password;

    protected Usuario() {}

    public Usuario(String email, String nome, String cpf, String cep, String telefone) {
        this.email = email;
        this.nome = nome;
        this.cpf = cpf;
        this.cep = cep;
        this.telefone = telefone;
    }

    public String getEmail() { return email; }
    public String getNome() { return nome; }
}
