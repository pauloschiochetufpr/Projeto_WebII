package com.manutencao.trabalhoweb2.service;

import com.manutencao.trabalhoweb2.model.TokenBlacklist;
import com.manutencao.trabalhoweb2.repository.TokenBlacklistRepository;
import com.manutencao.trabalhoweb2.utils.JwtUtil;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;
import java.util.Map;
import java.util.Optional;

@Service
public class TokenAdminService {
    
  @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private TokenBlacklistRepository blacklistRepository;

    // 1. Solicitar novo access token
    @Transactional
    public Optional<String> gerarNovoAccessToken(String refreshToken) {
        try {
            // Se refresh estiver na blacklist, recusar
            if (blacklistRepository.existsByToken(refreshToken)) {
                return Optional.empty();
            }

            // Validar refresh token
            if (!jwtUtil.isTokenValid(refreshToken)) {
                return Optional.empty();
            }

            // Decodificar claims
            Claims claims = jwtUtil.getAllClaims(refreshToken);

            // Obter subject (email)
            String email = claims.getSubject();

            // Gerar novo access token com dados atualizados
            Map<String, Object> newClaims = Map.of(
                "email", email,
                "tipoUsuario", claims.get("tipoUsuario", String.class),
                "criadoEm", Instant.now().getEpochSecond(),
                "expiraEm", Instant.now().plusSeconds(15 * 60).getEpochSecond()
            );

            String novoAccess = jwtUtil.generateAccessToken(email, newClaims);
            return Optional.of(novoAccess);

        } catch (JwtException e) {
            return Optional.empty();
        }
    }

    // 2. Adicionar token na blacklist
    @Transactional
    public void adicionarNaBlacklist(String token) {
        if (token == null || token.isBlank()) return;

        try {
            Date exp = jwtUtil.getExpiration(token);
            LocalDateTime dataExp = LocalDateTime.ofInstant(exp.toInstant(), ZoneId.systemDefault());
            TokenBlacklist entry = new TokenBlacklist(token, dataExp);
            entry.setRevogado(true);
            blacklistRepository.save(entry);
        } catch (JwtException e) {
            // Mesmo tokens inválidos podem ser adicionados (por segurança)
            TokenBlacklist entry = new TokenBlacklist(token, LocalDateTime.now().plusDays(7));
            entry.setRevogado(true);
            blacklistRepository.save(entry);
        }
    }

    // 3. Obter data de expiração do token
    public Optional<LocalDateTime> obterExpiracao(String token) {
        try {
            Date exp = jwtUtil.getExpiration(token);
            return Optional.of(LocalDateTime.ofInstant(exp.toInstant(), ZoneId.systemDefault()));
        } catch (JwtException e) {
            return Optional.empty();
        }
    }

    // 4. Retornar todos os dados (claims) do token
    public Optional<Map<String, Object>> obterDadosToken(String token) {
        try {
            Claims claims = jwtUtil.getAllClaims(token);
            return Optional.of(claims);
        } catch (JwtException e) {
            return Optional.empty();
        }
    }


    @Transactional
    public void limparBlacklistExpirada() {
        blacklistRepository.deleteByDataExpiracaoBefore(LocalDateTime.now());
    }

}
