package com.a205.beatween.common.event;

import com.a205.beatween.domain.drawing.service.DrawingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

@Component
@RequiredArgsConstructor
@Slf4j
public class WebSocketEventHandler {

    private final RedisTemplate<String, Object> redisTemplate;
    private final DrawingService drawingService;

    @EventListener
    public void handleSessionConnect(SessionConnectEvent event) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(event.getMessage());
        String spaceId = accessor.getFirstNativeHeader("spaceId");

        if (spaceId != null) {
            String key = "ws:session:" + spaceId;
            Long count = redisTemplate.opsForValue().increment(key);
            log.info("🟢 WebSocket 연결됨 - spaceId: {}, 현재 세션 수: {}", spaceId, count);
        } else {
            log.warn("❗ WebSocket 연결 시 spaceId 누락");
        }
    }

    // WebSocket 종료 시
    @EventListener
    public void handleSessionDisconnect(SessionDisconnectEvent event) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(event.getMessage());
        String spaceId = accessor.getFirstNativeHeader("spaceId");
        String songIdHeader = accessor.getFirstNativeHeader("songId");

        if (spaceId != null && songIdHeader != null) {
            String key = "ws:session:" + spaceId;
            Long count = redisTemplate.opsForValue().decrement(key);
            log.info("🔴 WebSocket 종료 - spaceId: {}, 남은 세션 수: {}", spaceId, count);

            if (count != null && count <= 0) {
                // ✅ 마지막 세션 퇴장 → 드로잉 DB 저장
                try {
                    int songId = Integer.parseInt(songIdHeader);
                    drawingService.saveAllDrawingList(songId);
                    redisTemplate.delete(key);
                    log.info("✅ 마지막 사용자 퇴장 - songId: {} 드로잉 DB 저장 완료", songId);
                } catch (NumberFormatException e) {
                    log.error("❌ songId 파싱 실패: {}", songIdHeader);
                }
            }
        } else {
            log.warn("❗ WebSocket 종료 시 필요한 헤더 누락 (spaceId 또는 songId)");
        }
    }
}
