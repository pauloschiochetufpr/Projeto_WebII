package com.manutencao.trabalhoweb2.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.manutencao.trabalhoweb2.model.CepModel;

@Repository
public interface CepRepository extends JpaRepository<CepModel, String> {
    boolean existsByCep(String cep);
    CepModel findByCep(String cep);
}
