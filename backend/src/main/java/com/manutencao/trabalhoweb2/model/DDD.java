package com.manutencao.trabalhoweb2.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "ddd_validos")
public class DDD {
    @Id
    private String ddd; // armazena o DDD

    // getters e setters
    public String getDdd() {
        return ddd;
    }

    public void setDdd(String ddd) {
        this.ddd = ddd;
    }
}
