package com.a205.beatween.common.event;

import com.a205.beatween.domain.drawing.service.DrawingService;
import com.a205.beatween.domain.play.service.PlayService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.util.Objects;
import java.util.Set;

@Component
@RequiredArgsConstructor
@Slf4j
public class WebSocketEventHandler {

    private final RedisTemplate<String, Object> redisTemplate;
    private final PlayService playService;

    @EventListener
    public void handleSessionConnect(SessionConnectEvent event) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(event.getMessage());
        String spaceId = accessor.getFirstNativeHeader("spaceId");
        String userId = accessor.getFirstNativeHeader("userId");
        String sessionId = accessor.getSessionId();
        long now = System.currentTimeMillis();

        if (spaceId != null && sessionId != null && userId != null) {
            String sessionCountKey = "ws:space:" + spaceId + ":sessionCount";
            String sessionToUserKey = "ws:space:" + spaceId + ":session:" + sessionId;
            String userToSessionKey = "ws:space:" + spaceId + ":user:" + userId;
            String memberKey = "ws:space:" + spaceId + ":members";
            String managerKey = "ws:space:" + spaceId + ":manager";

            redisTemplate.opsForValue().set(sessionToUserKey, userId);
            redisTemplate.opsForValue().set(userToSessionKey, sessionId);
            redisTemplate.opsForZSet().add(memberKey, sessionId, now);

            final boolean isManager;

            if (Boolean.FALSE.equals(redisTemplate.hasKey(managerKey))) {
                redisTemplate.opsForValue().set(managerKey, sessionId);
                log.info("리더 최초 지정 - sessionId: {}", sessionId);
                isManager = true;
            } else {
                String currentManager = (String) redisTemplate.opsForValue().get(managerKey);
                isManager = sessionId.equals(currentManager);
            }


            Long count = redisTemplate.opsForValue().increment(sessionCountKey);
            log.info("WebSocket 연결 - spaceId: {}, 접속자 수: {}", spaceId, count);

            new Thread(() -> {
                try {
                    Thread.sleep(300);
                    playService.sendInitialManagerStatus(userId, spaceId, isManager);
                } catch (InterruptedException e) {
                    log.warn("리더 상태 전송 실패", e);
                }
            }).start();

        } else {
            log.warn("WebSocket 연결 시 필요한 헤더 누락 (spaceId, userId)");
        }
    }

}
