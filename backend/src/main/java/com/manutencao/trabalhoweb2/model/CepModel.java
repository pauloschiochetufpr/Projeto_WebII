package com.manutencao.trabalhoweb2.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "cep")
public class CepModel {


    @Id
    @Column(length = 8, nullable = false)
    private String cep;
    
    private String logradouro;
    private String complemento;
    private String bairro;
    private String localidade;
    private String uf;
    private String ibge;
    private String gia;
    private String ddd;
    private String siafi;

    // Getters
    public String getCep() { return cep; }
    public String getLogradouro() { return logradouro; }
    public String getComplemento() { return complemento; }
    public String getBairro() { return bairro; }
    public String getLocalidade() { return localidade; }
    public String getUf() { return uf; }
    public String getIbge() { return ibge; }
    public String getGia() { return gia; }
    public String getDdd() { return ddd; }

    
    public String getSiafi() {
        return siafi;
    }
    
    // Setters

    public void setCep(String cep) {
        // Remove qualquer hífen do CEP antes de salvar
        if (cep != null) {
            this.cep = cep.replaceAll("-", "");
        } else {
            this.cep = null;
        }
    }
}
