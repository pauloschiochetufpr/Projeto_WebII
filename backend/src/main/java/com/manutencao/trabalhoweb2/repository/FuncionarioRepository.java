package com.manutencao.trabalhoweb2.repository;

import com.manutencao.trabalhoweb2.model.Funcionario;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface FuncionarioRepository extends JpaRepository<Funcionario, Long> {
    Optional<Funcionario> findByEmail(String email);

    Optional<Funcionario> findById(long id);
}
