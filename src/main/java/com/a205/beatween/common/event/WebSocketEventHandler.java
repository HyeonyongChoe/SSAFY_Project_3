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

        if (spaceId != null && sessionId != null) {
            String sessionCountKey = "ws:space:" + spaceId + ":sessionCount";
            String userKey = "ws:space:" + spaceId + ":session:" + sessionId;
            String memberKey = "ws:space:" + spaceId + ":members";
            String managerKey = "ws:space:" + spaceId + ":manager";

            Long count = redisTemplate.opsForValue().decrement(sessionCountKey);
            log.info("WebSocket 종료 - spaceId: {}, sessionId: {}, 남은 접속자 수: {}", spaceId, sessionId, count);

            redisTemplate.opsForZSet().remove(memberKey, sessionId);
            redisTemplate.delete(userKey);

            String currentLeaderSessionId = (String) redisTemplate.opsForValue().get(managerKey);
            if (Objects.equals(sessionId, currentLeaderSessionId)) {
                String newLeaderSessionId = redisTemplate.opsForZSet()
                        .range(memberKey, 0, 0)
                        .stream()
                        .map(String.class::cast)
                        .findFirst()
                        .orElse(null);

                if (newLeaderSessionId != null) {
                    redisTemplate.opsForValue().set(managerKey, newLeaderSessionId);
                    log.info("리더 변경 - newLeaderSessionId: {}", newLeaderSessionId);
                }
            }

            if (count != null && count <= 0) {
                String pattern = "drawings:" + spaceId + ":*";
                Set<String> drawingKeys = redisTemplate.keys(pattern);

                List<Integer> copySheetIds = drawingKeys.stream()
                        .map(key -> {
                            String[] parts = key.split(":");
                            return Integer.parseInt(parts[2]);
                        })
                        .toList();

                drawingService.saveAllDrawingsBySpaceId(spaceId);

                Set<Object> allSessionIds = redisTemplate.opsForZSet().range(memberKey, 0, -1);
                if (allSessionIds != null) {
                    for (Object sid : allSessionIds) {
                        String key = "ws:space:" + spaceId + ":session:" + sid;
                        redisTemplate.delete(key);
                    }
                }
                redisTemplate.delete(sessionCountKey);
                redisTemplate.delete(memberKey);
                redisTemplate.delete(managerKey);
                log.info("마지막 사용자 퇴장 - 드로잉 저장 및 캐시 정리 완료: {}", copySheetIds);
            }

        } else {
            log.warn("WebSocket 종료 시 필요한 헤더 누락 (spaceId, sessionId, copySheetIds)");
        }
    }
}
