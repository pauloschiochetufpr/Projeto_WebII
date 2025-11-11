package com.manutencao.trabalhoweb2.utils;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.Map;

@Component
public class JwtUtil {

    private final Key key;
    private final long accessExpMinutes;
    private final long refreshExpDays;

    public JwtUtil(
                    @Value("${jwt.secret}") String secret,
                    @Value("${jwt.access.expiration-minutes}") long accessExpMinutes,
                    @Value("${jwt.refresh.expiration-days}") long refreshExpDays
                ) 
                {
                    this.key = Keys.hmacShaKeyFor(secret.getBytes());
                    this.accessExpMinutes = accessExpMinutes;
                    this.refreshExpDays = refreshExpDays;
                }
    


    /**
    * subject = ID do cliente (só avisando)
    */
    public String generateAccessToken(String subject, Map<String, Object> claims) {
        return Jwts.builder()
                .setSubject(subject)
                .addClaims(claims)
                .setExpiration(Date.from(Instant.now().plus(accessExpMinutes, ChronoUnit.MINUTES)))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public String generateRefreshToken(String subject) {
        return Jwts.builder()
                .setSubject(subject)
                .setExpiration(Date.from(Instant.now().plus(refreshExpDays, ChronoUnit.DAYS)))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public boolean isTokenValid(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
            return true;
        } catch (JwtException e) {
            return false;
        }
    }

    public Date getExpiration(String token) {
        return Jwts.parserBuilder().setSigningKey(key).build()
                .parseClaimsJws(token).getBody().getExpiration();
    }

    public String getSubject(String token) {
        return Jwts.parserBuilder().setSigningKey(key).build()
                .parseClaimsJws(token).getBody().getSubject();
    }

    public Claims getAllClaims(String token) {
        return Jwts.parserBuilder().setSigningKey(key).build()
                .parseClaimsJws(token).getBody();
    }
}
