package com.a205.beatween.common.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
public class JwtUtil {
	private String key = "BEATWEEN_A_AND_B_SecretKey_SecretKey_SecretKey";
	private SecretKey secretKey = Keys.hmacShaKeyFor(key.getBytes(StandardCharsets.UTF_8));

	public String createAccessToken(String userId) {
		long fourHoursInMs = 1000L * 60 * 60 * 4; // 4시간
//		long oneHourInMs = 1000L * 20; // 20초

//		System.out.println("createAccessToken : 20초짜리 액세스 토큰 생성");
		System.out.println("createAccessToken : 4시간짜리 액세스 토큰 생성");

		Date exp = new Date(System.currentTimeMillis() + fourHoursInMs); // 4시간
//		Date exp = new Date(System.currentTimeMillis() + oneHourInMs); // 4시간
		return Jwts.builder()
				.setSubject(userId) // subject 필드에 사용자 ID 설정
				.setExpiration(exp) // 만료 시간 설정
				.signWith(secretKey) // 비밀키로 서명
				.compact();
	}

	public String createRefreshToken(String userId) {
		long oneMonthInMs = 1000L * 60 * 60 * 24 * 30;  // 30일
		Date exp = new Date(System.currentTimeMillis() + oneMonthInMs);
		return Jwts.builder()
				.setSubject(userId)
				.setExpiration(exp)
				.claim("type", "refresh") // (선택) 토큰 타입 구분용
				.signWith(secretKey)
				.compact();
	}

	// JWT에서 사용자 ID 추출
	public int extractUserId(String authorizationHeader) {

		String rawHeader = authorizationHeader; // ex) "Bearer eyJ... abc..."
		String token = rawHeader
				.replaceFirst("(?i)^Bearer\\s+", "")  // "Bearer " 제거
				.replaceAll("\\s+", "");             // 모든 공백(스페이스, 탭, 개행) 제거

		Claims claims = Jwts.parser()
				.setSigningKey(secretKey)// 비밀키로 서명 검증
				.parseClaimsJws(token) // 토큰을 파싱하여 JWS(JWT with Signature) 반환
				.getBody(); // Payload 반환
		return Integer.parseInt(claims.getSubject()); // 사용자 ID 반환
	}

	// 액세스 토큰 검증
	public boolean isAccessTokenValid(String token) {
		try {
			Claims claims = Jwts.parser()
					.setSigningKey(secretKey) // 비밀키로 서명 검증
					.parseClaimsJws(token) // JWS로 서명, 만료 기한 검증. 만약 만료되었다면 자동으로 예외 처리됨
					.getBody(); // Payload 반환
		} catch (Exception e) {
			return false; // 유효하지 않은 토큰
		}
		return true; // 유효한 토큰
	}
}



