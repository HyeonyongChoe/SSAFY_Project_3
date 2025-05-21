package com.a205.beatween.domain.user.controller;

import com.a205.beatween.common.reponse.ResponseDto;
import com.a205.beatween.common.reponse.Result;
import com.a205.beatween.domain.space.dto.SpacePreDto;
import com.a205.beatween.domain.space.service.SpaceService;
import com.a205.beatween.domain.user.dto.UserInfoDto;
import com.a205.beatween.domain.user.entity.User;
import com.a205.beatween.domain.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    // 사용자 회원가입
//    @PostMapping("/signup")
//    public ResponseEntity<Result<?>> signup(@RequestBody User user) {
//        if (userService.signup(user)) {
//            return ResponseEntity.status(HttpStatus.CREATED).body("User added successfully");
//        }
//        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to add user");
//    }

    @PostMapping("/signup")
    public ResponseEntity<Result<?>> signup(@RequestBody User user) {
        userService.signup(user);
    }



//    // 사용자 로그인
//    @PostMapping("/login")
//    public ResponseEntity<Map<String, Object>> login(@RequestBody User user) {
//        HttpStatus status = null;
//        Map<String, Object> result = new HashMap<>();
//        User loginUser = userService.login(user.getId(), user.getPassword());
//
//        System.out.println(loginUser);
//        if (loginUser != null) {
//            result.put("message", "login 성공");
//            result.put("access-token", jwtUtil.createToken(loginUser.getId()));
//            status = HttpStatus.ACCEPTED;
//        } else {
//            status = HttpStatus.INTERNAL_SERVER_ERROR;
//        }
//        return new ResponseEntity<>(result, status);
//    }

    @GetMapping("/info")
    public ResponseEntity<Result<?>> getUserInfo(
            @RequestHeader("X-USER-ID") Integer userId
    ) {
        Result<UserInfoDto> userInfoDtoResult = userService.getUserInfo(userId);
        return ResponseEntity.ok(userInfoDtoResult);
    }

    @PatchMapping("/")
    public ResponseEntity<ResponseDto<Object>> updateUserInfo(
            @RequestHeader("X-USER-ID") Integer userId,
            @RequestParam(value = "nickName", required = false) String nickName,
            @RequestPart(value = "image", required = false) MultipartFile image
    ) throws IOException {
        userService.updateUserInfo(userId,nickName,image);
        ResponseDto<Object> result = ResponseDto
                .builder()
                .success(true)
                .data("유저 정보 수정 완료")
                .build();
        return ResponseEntity.ok(result);
    }
}