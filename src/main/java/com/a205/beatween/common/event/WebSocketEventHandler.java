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

import java.util.List;
import java.util.Objects;
import java.util.Set;

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
        String userId = accessor.getFirstNativeHeader("userId");
        String sessionId = accessor.getSessionId();
        long now = System.currentTimeMillis();

        if (spaceId != null && sessionId != null && userId != null) {
            String sessionCountKey = "ws:space:" + spaceId + ":sessionCount";
            String userKey = "ws:space:" + spaceId + ":session:" + sessionId;
            String memberKey = "ws:space:" + spaceId + ":members";
            String managerKey = "ws:space:" + spaceId + ":manager";

            redisTemplate.opsForValue().set(userKey, userId);
            redisTemplate.opsForZSet().add(memberKey, sessionId, now);

            if (Boolean.FALSE.equals(redisTemplate.hasKey(managerKey))) {
                redisTemplate.opsForValue().set(managerKey, sessionId);
                log.info("리더 최초 지정 - sessionId: {}", sessionId);
            }

            Long count = redisTemplate.opsForValue().increment(sessionCountKey);
            log.info("WebSocket 연결 - spaceId: {}, 접속자 수: {}", spaceId, count);
        } else {
            log.warn("WebSocket 연결 시 필요한 헤더 누락 (spaceId, userId)");
        }
    }

    @EventListener
    public void handleSessionDisconnect(SessionDisconnectEvent event) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(event.getMessage());
        String spaceId = accessor.getFirstNativeHeader("spaceId");
        String sessionId = accessor.getSessionId();

        // spaceId 없이 disconnect 된 경우는 로그만 출력 (예: 브라우저 강제 종료)
        if (spaceId == null || sessionId == null) {
            log.warn("WebSocket 종료 시 필요한 헤더 누락 (spaceId or sessionId)");
            return;
        }

        log.info("WebSocket 종료 감지됨 (spaceId: {}, sessionId: {})", spaceId, sessionId);
    }

}
