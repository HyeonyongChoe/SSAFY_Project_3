package com.a205.beatween.common.filter;

import com.a205.beatween.common.jwt.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final JwtUtil jwtUtil;

    public JwtAuthenticationFilter(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain chain)
            throws ServletException, IOException {
        // Authorization 헤더 확인
        String rawHeader = request.getHeader("Authorization");
        String token = "";
        if (rawHeader != null && rawHeader.startsWith("Bearer ")) {
            token = rawHeader
                    .replaceFirst("(?i)^Bearer\\s+", "")  // "Bearer " 제거
                    .replaceAll("\\s+", "");             // 모든 공백(스페이스, 탭, 개행) 제거
        }

        if (token == null || !jwtUtil.isAccessTokenValid(token)) {
            // 만료 or 잘못된 토큰 → 401 응답하고 필터 체인 중단
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "유효하지 않거나 만료된 액세스 토큰입니다.");
            return;
        }

        int userId = 0;
        if (jwtUtil.isAccessTokenValid(token)) {
            userId = jwtUtil.extractUserId(rawHeader);

            // Authentication 객체 생성
            UsernamePasswordAuthenticationToken auth =
                    new UsernamePasswordAuthenticationToken(userId, null, List.of());

            // SecurityContext에 인증 정보 등록
            SecurityContextHolder
                    .getContext()
                    .setAuthentication(auth);
        }

        // 필터 체인 계속 실행 : 컨트롤러로 요청 넘기기
        chain.doFilter(request, response);
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        // 호출 경로를 찍어 봅니다
        System.out.println("ServletPath: " + request.getServletPath());
        System.out.println("RequestURI:  " + request.getRequestURI());

        String path = request.getServletPath();
        if (path.startsWith("/api/v1/auth/") ||
                path.equals("/api/v1/users/signup") ||
                path.equals("/api/v1/users/login") ||
                path.equals("/api/v1/test") ||
                path.equals("/api/test")) {
            return true;
        }

        // Swagger
        if (path.equals("/swagger-ui.html") ||
                path.startsWith("/swagger-ui/") ||
                path.startsWith("/v3/api-docs")) {
            return true;
        }

        return false;
    }
}
