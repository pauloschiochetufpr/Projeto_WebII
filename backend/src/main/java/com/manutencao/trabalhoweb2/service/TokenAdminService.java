package com.manutencao.trabalhoweb2.service;

import com.manutencao.trabalhoweb2.model.TokenBlacklist;
import com.manutencao.trabalhoweb2.repository.TokenBlacklistRepository;
import com.manutencao.trabalhoweb2.utils.JwtUtil;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.manutencao.trabalhoweb2.dto.AuthResponse;
import com.manutencao.trabalhoweb2.dto.BasicResponse;

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

    // Para assegurar rotas
    // Basta enviar o cargo requerido como parametro e ele retorna boolean padrão, assim você realiza sua verificação facilmente com if e um return
    @Transactional
    public boolean authCargo(String cargo, String accessToken) {
        try {
            // Verifica se o token foi passado
            if (accessToken == null || accessToken.isBlank()) {
                return false;
            }

            // Remove prefixo "Bearer " caso venha
            if (accessToken.startsWith("Bearer ")) {
                accessToken = accessToken.substring(7);
            }

            // Verifica se token é válido (assinatura e expiração)
            if (!jwtUtil.isTokenValid(accessToken)) {
                return false;
            }

            // Decodifica claims do token
            Claims claims = jwtUtil.getAllClaims(accessToken);

            // Obtem o campo "tipoUsuario"
            String tipoUsuario = claims.get("tipoUsuario", String.class);

            // Comparação
            if (tipoUsuario != null && tipoUsuario.equalsIgnoreCase(cargo)) {
                return true;
            }

            return false;

        } catch (JwtException e) {
            // Erros de token
            System.err.println("Erro JWT: " + e.getMessage());
            return false;
        } catch (Exception e) {
            // Erros inesperados
            System.err.println("Erro em authCargo: " + e.getMessage());
            return false;
        }
    }


    // Operação de Logout
    @Transactional
    public BasicResponse logout(String refreshToken) {
        try{
            if (refreshToken == null || refreshToken.isBlank()) {
                // Se não há token não importa
                return new BasicResponse(200, "Logout efetuado com sucesso");
            }
                
            if (blacklistRepository.existsByToken(refreshToken)) {
                // Se já está na blacklist o processo apenas faz com que retorne positivo para o front apagar credenciais
                return new BasicResponse(200, "Logout efetuado com sucesso");
            }

            adicionarNaBlacklist(refreshToken);

            return new BasicResponse(200, "Logout efetuado com sucesso");
        } catch (Exception e) {
            System.err.println("Erro no logout: " + e.getMessage());
            e.printStackTrace();
            // Como que deu erro kkkkkk
            return new BasicResponse(500, "Erro ao efetuar logout");
        }

    }

    // Solicitar novo access token
    @Transactional
    public AuthResponse tokenRotation(String refreshToken) {
        try {
            // Token ausente
            if (refreshToken == null || refreshToken.isBlank()) {
                return new AuthResponse(400, "Token de atualização ausente");
            }

            // Token já foi usado
            if (blacklistRepository.existsByToken(refreshToken)) {
                return new AuthResponse(401, "Token inválido ou já utilizado");
            }

            // Valida assinatura e expiração do refresh
            if (!jwtUtil.isTokenValid(refreshToken)) {
                return new AuthResponse(401, "Token de atualização expirado ou inválido");
            }

            // Decodifica claims
            Claims claims = jwtUtil.getAllClaims(refreshToken);

            // Obtem o subject (id do cliente)
            String idClienteStr = claims.getSubject();
            if (idClienteStr == null || idClienteStr.isBlank()) {
                return new AuthResponse(400, "Token de atualização corrompido");
            }

            Long idCliente;
            try {
                idCliente = Long.parseLong(idClienteStr);
            } catch (NumberFormatException nfe) {
                return new AuthResponse(400, "Formato de ID inválido no token");
            }

            // Adiciona o refresh antigo na blacklist
            adicionarNaBlacklist(refreshToken);

            // Gera novo access token e refresh token
            Map<String, Object> newClaims = Map.of(
                "idCliente", idCliente,
                "tipoUsuario", claims.get("tipoUsuario", String.class),
                "exp", Instant.now().plusSeconds(15 * 60).getEpochSecond()
            );

            String novoAccess = jwtUtil.generateAccessToken(idClienteStr, newClaims);
            String novoRefresh = jwtUtil.generateRefreshToken(idClienteStr);

            return new AuthResponse(novoAccess, novoRefresh);

        } catch (JwtException e) {
            // Erros relacionados ao token JWT
            e.printStackTrace();
            return new AuthResponse(401, "Token de atualização inválido");
        } catch (Exception e) {
            // Erros inesperados
            e.printStackTrace();
            return new AuthResponse(500, "Erro interno ao renovar token");
        }
    }


    // Adicionar token na blacklist
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

    // Obter data de expiração do token
    public Optional<LocalDateTime> obterExpiracao(String token) {
        try {
            Date exp = jwtUtil.getExpiration(token);
            return Optional.of(LocalDateTime.ofInstant(exp.toInstant(), ZoneId.systemDefault()));
        } catch (JwtException e) {
            return Optional.empty();
        }
    }

    // Retornar todos os dados (claims) do token
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
