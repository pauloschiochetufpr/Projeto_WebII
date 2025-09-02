package com.manutencao.trabalhoweb2.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.manutencao.trabalhoweb2.model.Usuario;
import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findByEmail(String email);
}
