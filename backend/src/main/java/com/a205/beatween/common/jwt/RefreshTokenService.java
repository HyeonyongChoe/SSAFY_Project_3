package com.a205.beatween.common.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.Optional;

@Service
public class RefreshTokenService {
    private final StringRedisTemplate stringRedisTemplate;
    private static final Duration REFRESH_TOKEN_TTL = Duration.ofDays(30);
    private static final String PREFIX = "refresh_token:";
    private String key = "BEATWEEN_A_AND_B_SecretKey_SecretKey_SecretKey";
    private SecretKey secretKey = Keys.hmacShaKeyFor(key.getBytes(StandardCharsets.UTF_8));

    public RefreshTokenService(StringRedisTemplate stringRedisTemplate) {
        this.stringRedisTemplate = stringRedisTemplate;
    }


    public void storeRefreshToken(String userId, String refreshToken) {
        String key = PREFIX + userId;
        // key에 refreshToken을 저장하고, TTL을 설정
        stringRedisTemplate.opsForValue()
                .set(key, refreshToken, REFRESH_TOKEN_TTL);
    }


    public Optional<String> getRefreshToken(String userId) {
        String key = PREFIX + userId;
        String token = stringRedisTemplate.opsForValue().get(key);
        return Optional.ofNullable(token);
    }


    public void deleteRefreshToken(String userId) {
        String key = PREFIX + userId;
        stringRedisTemplate.delete(key);
    }

    public boolean isRefreshTokenValid(String token) {
        Claims claims = null;
        try {
            claims = Jwts.parser()
                    .setSigningKey(secretKey)
                    .parseClaimsJws(token) // JWS로 서명, 만료 기한 검증. 만약 만료되었다면 예외 던짐
                    .getBody(); // Payload 반환
        } catch (Exception e) {
            // 토큰이 유효하지 않거나 만료된 경우
            return false;
        }


        // 타입 확인
        String type = claims.get("type", String.class);
        if(!type.equals("refresh")) {
            return false;
        }
        return true;
    }

    public String extractUserId(String token) {
        Claims claims = Jwts.parser()
                .setSigningKey(secretKey)
                .parseClaimsJws(token)
                .getBody();

        return claims.getSubject();  // userId
    }
}
