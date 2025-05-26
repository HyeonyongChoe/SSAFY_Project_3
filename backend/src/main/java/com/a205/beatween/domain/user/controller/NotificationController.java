package com.a205.beatween.domain.user.controller;

import com.a205.beatween.common.jwt.JwtUtil;
import com.a205.beatween.common.reponse.ResponseDto;
import com.a205.beatween.domain.user.dto.NotificationDto;
import com.a205.beatween.domain.user.entity.Notification;
import com.a205.beatween.domain.user.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final JwtUtil jwtUtil;
    private final NotificationService notificationService;

    @GetMapping("/")
    public ResponseEntity<ResponseDto<Object>> getNotifications(
            @RequestHeader("Authorization") String token
    ) {
        Integer userId = jwtUtil.extractUserId(token);
        List<NotificationDto> notificationList = notificationService.getNotifications(userId);
        ResponseDto<Object> result = ResponseDto
                .builder()
                .success(true)
                .data(notificationList)
                .build();
        return ResponseEntity.ok(result);
    }

    @PatchMapping("/{userNotificationId}")
    public ResponseEntity<ResponseDto<Object>> updateUserNotification(
            @PathVariable("userNotificationId") Integer userNotificationId
    ) {
        Integer spaceId = notificationService.updateUserNotification(userNotificationId);
        Map<String,Integer> map = new HashMap<>();
        map.put("spaceId", spaceId);
        ResponseDto<Object> result = ResponseDto
                .builder()
                .success(true)
                .data(map)
                .build();
        return ResponseEntity.ok(result);
    }

    @DeleteMapping("/{userNotificationId}")
    public ResponseEntity<ResponseDto<Object>> deleteUserNotification(
            @PathVariable("userNotificationId") Integer userNotificationId
    ) {
        notificationService.deleteUserNotification(userNotificationId);
        ResponseDto<Object> result = ResponseDto
                .builder()
                .success(true)
                .build();
        return ResponseEntity.ok(result);
    }
}
