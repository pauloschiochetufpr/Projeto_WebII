package com.manutencao.trabalhoweb2.model;

import jakarta.persistence.*;

@Entity
@Table(name = "endereco")
public class Endereco {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_endereco")
    private Long id;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "cep", referencedColumnName = "cep")
    private CepModel cep;

    @Column(length = 2, nullable = false)
    private String uf;

    @Column(length = 128, nullable = false)
    private String localidade;

    @Column(length = 128, nullable = false)
    private String logradouro;

    @Column(length = 128, nullable = false)
    private String bairro;

    @Column(length = 255, nullable = false)
    private String complemento;

    @Column(nullable = false)
    private Integer numero;

    @Column(nullable = false)
    private Boolean principal = false;

    @Column(nullable = false)
    private Boolean ativo = true;

    public Endereco() {}

    public Endereco(CepModel cep, String uf, String localidade, String logradouro, String bairro, String complemento, Integer numero) {
        this.cep = cep;
        this.uf = uf;
        this.localidade = localidade;
        this.logradouro = logradouro;
        this.bairro = bairro;
        this.complemento = complemento;
        this.numero = numero;
    }

    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public CepModel getCep() { return cep; }
    public void setCep(CepModel cep) { this.cep = cep; }

    public String getUf() { return uf; }
    public void setUf(String uf) { this.uf = uf; }

    public String getLocalidade() { return localidade; }
    public void setLocalidade(String localidade) { this.localidade = localidade; }

    public String getLogradouro() { return logradouro; }
    public void setLogradouro(String logradouro) { this.logradouro = logradouro; }

    public String getBairro() { return bairro; }
    public void setBairro(String bairro) { this.bairro = bairro; }

    public String getComplemento() { return complemento; }
    public void setComplemento(String complemento) { this.complemento = complemento; }

    public Integer getNumero() { return numero; }
    public void setNumero(Integer numero) { this.numero = numero; }

    public Boolean getPrincipal() { return principal; }
    public void setPrincipal(Boolean principal) { this.principal = principal; }

    public Boolean getAtivo() { return ativo; }
    public void setAtivo(Boolean ativo) { this.ativo = ativo; }
}
