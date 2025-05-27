package com.a205.beatween.common.jwt;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Optional;

@Service
public class RefreshTokenService {
    private final StringRedisTemplate stringRedisTemplate;
    private static final Duration REFRESH_TOKEN_TTL = Duration.ofDays(28);
    private static final String PREFIX = "refresh_token:";

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
}
