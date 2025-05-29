package com.a205.beatween.domain.auth.controller;

import com.a205.beatween.common.jwt.JwtUtil;
import com.a205.beatween.common.jwt.RefreshTokenService;
import com.a205.beatween.common.reponse.Result;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Duration;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {
    private final JwtUtil jwtUtil;
    private final RefreshTokenService refreshTokenService;

    @PostMapping("/refresh-token")
    public ResponseEntity<Result<?>> refresh(
            @CookieValue(name="refreshToken", required=false) String refreshToken,
            HttpServletResponse response
    ) {
        // 쿠키에 토큰이 없으면 error
        if(refreshToken == null || refreshToken.isEmpty() ) {
            return ResponseEntity.ok(
                    Result.error(HttpStatus.UNAUTHORIZED.value(), "리프레시 토큰이 없습니다."));
        }

        // 리프레시 토큰 검증
        if(!refreshTokenService.isRefreshTokenValid(refreshToken)) {
            return ResponseEntity.ok(
                    Result.error(HttpStatus.UNAUTHORIZED.value(), "리프레시 토큰 검증에 실패했습니다."));
        }

        // 리프레시 토큰의 userId가 Redis에 저장된 토큰과 일치하는지 확인
        String userId = refreshTokenService.extractUserId(refreshToken);
        String savedToken = refreshTokenService.getRefreshToken(userId)
                .orElse(null);

        if(savedToken == null || !savedToken.equals(refreshToken)) {
            return ResponseEntity.ok(
                    Result.error(HttpStatus.UNAUTHORIZED.value(), "저장된 리프레시 토큰과 일치하지 않습니다."));
        }

        // 새로운 토큰 발급
        String newAccessToken = jwtUtil.createAccessToken(userId);
        String newRefreshToken = jwtUtil.createRefreshToken(userId);

        // Redis, cookie에 새 토큰 저장
        refreshTokenService.storeRefreshToken(userId, newRefreshToken);
        Cookie cookie = new Cookie("refreshToken", newRefreshToken);
        cookie.setHttpOnly(true);
        cookie.setSecure(true);          // HTTPS 환경이라면 true
        cookie.setPath("/");
        cookie.setMaxAge((int) Duration.ofDays(30).getSeconds());
        response.addCookie(cookie);

        // 응답 바디에는 accessToken만 담음
        Map<String, String> data = Map.of("accessToken", newAccessToken);
        return ResponseEntity.ok(Result.success(data));
    }
}
