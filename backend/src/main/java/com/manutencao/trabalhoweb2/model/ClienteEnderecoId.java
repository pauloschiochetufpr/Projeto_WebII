package com.manutencao.trabalhoweb2.model;

import jakarta.persistence.*;
import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class ClienteEnderecoId implements Serializable {

    @Column(name = "id_cliente")
    private Long idCliente;

    @Column(name = "id_endereco")
    private Long idEndereco;

    public ClienteEnderecoId() {}

    public ClienteEnderecoId(Long idCliente, Long idEndereco) {
        this.idCliente = idCliente;
        this.idEndereco = idEndereco;
    }

    // getters e setters
    public Long getIdCliente() { return idCliente; }
    public void setIdCliente(Long idCliente) { this.idCliente = idCliente; }

    public Long getIdEndereco() { return idEndereco; }
    public void setIdEndereco(Long idEndereco) { this.idEndereco = idEndereco; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof ClienteEnderecoId)) return false;
        ClienteEnderecoId that = (ClienteEnderecoId) o;
        return Objects.equals(idCliente, that.idCliente) &&
               Objects.equals(idEndereco, that.idEndereco);
    }

    @Override
    public int hashCode() {
        return Objects.hash(idCliente, idEndereco);
    }
}
