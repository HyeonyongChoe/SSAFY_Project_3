package com.a205.beatween.domain.user.controller;

import com.a205.beatween.common.reponse.ResponseDto;
import com.a205.beatween.common.reponse.Result;
import com.a205.beatween.domain.space.dto.SpacePreDto;
import com.a205.beatween.domain.space.service.SpaceService;
import com.a205.beatween.domain.user.dto.LoginDto;
import com.a205.beatween.domain.user.dto.SignupDto;
import com.a205.beatween.domain.user.dto.UserInfoDto;
import com.a205.beatween.domain.user.entity.User;
import com.a205.beatween.domain.user.service.UserService;
import com.a205.beatween.common.jwt.JwtUtil;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.hibernate.boot.jaxb.mapping.JaxbQueryHint;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.Duration;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final JwtUtil jwtUtil;

    @PostMapping("/signup")
    public ResponseEntity<Result<?>> signup(@RequestBody SignupDto signupDto) {
        userService.signup(signupDto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Result.success("회원가입 성공"));
    }

    @PostMapping("/login")
    public ResponseEntity<Result<?>> login(
            @RequestBody LoginDto loginDto,
            HttpServletResponse response // 쿠키 설정을 위해 주입
    ) {
        Result<Map<String, String>> result = userService.login(loginDto);
        if(!result.isSuccess()) {
            return ResponseEntity.ok(result);
        }
        String accessToken = result.getData().get("accessToken");
        String refreshToken = result.getData().get("refreshToken");

        // HttpOnly 쿠키에 리프레시 토큰 담음
        Cookie cookie = new Cookie("refreshToken", refreshToken);
        cookie.setHttpOnly(true);
        cookie.setSecure(true);          // HTTPS 환경이라면 true
        cookie.setPath("/");
        cookie.setMaxAge((int) Duration.ofDays(30).getSeconds());
        response.addCookie(cookie);

        // 응답 바디에는 액세스 토큰만 담음
        Map<String, String> data = Map.of("accessToken", accessToken);
        return ResponseEntity.ok(Result.success(data));
    }

    @GetMapping("/info")
    public ResponseEntity<Result<?>> getUserInfo(
            @RequestHeader("Authorization") String token
    ) {
        Integer userId = jwtUtil.extractUserId(token);
        Result<UserInfoDto> userInfoDtoResult = userService.getUserInfo(userId);
        return ResponseEntity.ok(userInfoDtoResult);
    }

    @PatchMapping("/")
    public ResponseEntity<ResponseDto<Object>> updateUserInfo(
            @RequestHeader("Authorization") String token,
            @RequestParam(value = "nickName", required = false) String nickName,
            @RequestPart(value = "image", required = false) MultipartFile image
    ) throws IOException {
        Integer userId = jwtUtil.extractUserId(token);
        userService.updateUserInfo(userId,nickName,image);
        ResponseDto<Object> result = ResponseDto
                .builder()
                .success(true)
                .data("유저 정보 수정 완료")
                .build();
        return ResponseEntity.ok(result);
    }
}