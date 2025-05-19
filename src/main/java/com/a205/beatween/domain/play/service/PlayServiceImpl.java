package com.a205.beatween.domain.play.service;

import com.a205.beatween.domain.drawing.service.DrawingService;
import com.a205.beatween.domain.play.dto.ManagerChangedMessage;
import com.a205.beatween.domain.play.dto.ManagerStatusMessage;
import com.a205.beatween.domain.play.dto.PlayControlMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Slf4j
public class PlayServiceImpl implements PlayService {
    private final RedisTemplate<String, Object> redisTemplate;
    private final SimpMessagingTemplate messagingTemplate;
    private final DrawingService drawingService;

    @Override
    public void savePlaySession(PlayControlMessage message) {
        String key = "play:session:" + message.getSpaceId();
        redisTemplate.opsForValue().set(key, message);
    }

    @Override
    public PlayControlMessage getLatestState(Integer spaceId) {
        String key = "play:session:" + spaceId;
        Object raw = redisTemplate.opsForValue().get(key);

        if (raw instanceof PlayControlMessage message) {
            return message;
        }

        return null;
    }

    public void sendInitialManagerStatus(String userId, String spaceId, boolean isManager) {
        messagingTemplate.convertAndSendToUser(
                userId,
                "/queue/play/manager/" + spaceId,
                new ManagerStatusMessage(isManager)
        );
    }

    public void broadcastManagerChange(String spaceId, String newManagerSessionId) {
        messagingTemplate.convertAndSend(
                "/topic/play/manager/" + spaceId,
                new ManagerChangedMessage(newManagerSessionId)
        );
    }

    @Override
    public void handleManualDisconnect(String spaceId, String sessionId, int userId) {
        String sessionCountKey = "ws:space:" + spaceId + ":sessionCount";
        String sessionToUserKey = "ws:space:" + spaceId + ":session:" + sessionId;
        String userToSessionKey = "ws:space:" + spaceId + ":user:" + userId;
        String memberKey = "ws:space:" + spaceId + ":members";
        String managerKey = "ws:space:" + spaceId + ":manager";

        Long count = redisTemplate.opsForValue().decrement(sessionCountKey);
        log.info("수동 연결 해제 - spaceId: {}, sessionId: {}, 남은 접속자 수: {}", spaceId, sessionId, count);

        redisTemplate.opsForZSet().remove(memberKey, sessionId);
        redisTemplate.delete(sessionToUserKey);
        redisTemplate.delete(userToSessionKey);

        // 리더 재지정
        String currentLeader = (String) redisTemplate.opsForValue().get(managerKey);
        if (Objects.equals(currentLeader, sessionId)) {
            String newLeader = redisTemplate.opsForZSet()
                    .range(memberKey, 0, 0)
                    .stream()
                    .map(String.class::cast)
                    .findFirst()
                    .orElse(null);

            if (newLeader != null) {
                redisTemplate.opsForValue().set(managerKey, newLeader);
                log.info("리더 변경 - newLeader: {}", newLeader);
                broadcastManagerChange(spaceId, newLeader);
            }
        }

        // 마지막 사용자 → 드로잉 저장
        if (count != null && count <= 0) {
            Set<String> keys = redisTemplate.keys("drawings:" + spaceId + ":*");
            List<Integer> copySheetIds = keys.stream()
                    .map(k -> Integer.parseInt(k.split(":")[2]))
                    .toList();
            log.info("마지막 사용자 → 드로잉 저장 대상 copySheetIds: {}", copySheetIds);

            drawingService.saveAllDrawingsBySpaceId(spaceId);
            redisTemplate.delete(sessionCountKey);
            redisTemplate.delete(memberKey);
            redisTemplate.delete(managerKey);
            log.info("마지막 사용자 → 캐시 정리 완료: {}", spaceId);
        }
    }




}
