package com.a205.beatween.domain.user.controller;

import com.a205.beatween.common.reponse.ResponseDto;
import com.a205.beatween.common.reponse.Result;
import com.a205.beatween.domain.space.dto.SpacePreDto;
import com.a205.beatween.domain.space.service.SpaceService;
import com.a205.beatween.domain.user.dto.UserInfoDto;
import com.a205.beatween.domain.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

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