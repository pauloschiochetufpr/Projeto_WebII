package com.manutencao.trabalhoweb2.repository;

import com.manutencao.trabalhoweb2.model.TokenBlacklist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;

@Repository
public interface TokenBlacklistRepository extends JpaRepository<TokenBlacklist, String> {

    boolean existsByToken(String token);

    void deleteByDataExpiracaoBefore(LocalDateTime now);
}
