package com.manutencao.trabalhoweb2.repository;

import com.manutencao.trabalhoweb2.model.ClienteEndereco;
import com.manutencao.trabalhoweb2.model.ClienteEnderecoId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ClienteEnderecoRepository extends JpaRepository<ClienteEndereco, ClienteEnderecoId> {
}
