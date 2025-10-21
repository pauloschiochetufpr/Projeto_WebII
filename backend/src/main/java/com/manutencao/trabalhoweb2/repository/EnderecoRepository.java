package com.manutencao.trabalhoweb2.repository;

import com.manutencao.trabalhoweb2.model.Endereco;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EnderecoRepository extends JpaRepository<Endereco, Long> {
    
}
