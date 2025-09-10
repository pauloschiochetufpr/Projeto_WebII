package com.manutencao.trabalhoweb2.repository;
// Repository
import org.springframework.data.jpa.repository.JpaRepository;
import com.manutencao.trabalhoweb2.model.DDD;

public interface DDDRepository extends JpaRepository<DDD, String> {
    boolean existsByDdd(String ddd);
}
