package com.manutencao.trabalhoweb2.model;

import jakarta.persistence.*;

@Entity
@Table(name = "cliente_endereco")
public class ClienteEndereco {

    @EmbeddedId
    private ClienteEnderecoId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("idCliente")  // referencia a propriedade da chave composta
    @JoinColumn(name = "id_cliente") // deve coincidir exatamente com a coluna do banco
    private Cliente cliente;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("idEndereco")  // referencia a propriedade da chave composta
    @JoinColumn(name = "id_endereco") // deve coincidir exatamente com a coluna do banco
    private Endereco endereco;

    public ClienteEndereco() {}

    public ClienteEndereco(Cliente cliente, Endereco endereco) {
        this.cliente = cliente;
        this.endereco = endereco;
        this.id = new ClienteEnderecoId(cliente.getIdCliente(), endereco.getId());
    }

    // Getters e Setters
    public ClienteEnderecoId getId() { return id; }
    public void setId(ClienteEnderecoId id) { this.id = id; }

    public Cliente getCliente() { return cliente; }
    public void setCliente(Cliente cliente) { this.cliente = cliente; }

    public Endereco getEndereco() { return endereco; }
    public void setEndereco(Endereco endereco) { this.endereco = endereco; }
}
