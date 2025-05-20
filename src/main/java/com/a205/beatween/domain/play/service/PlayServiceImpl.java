package com.a205.beatween.domain.play.service;

import com.a205.beatween.common.reponse.Result;
import com.a205.beatween.domain.drawing.service.DrawingService;
import com.a205.beatween.domain.play.dto.*;
import com.a205.beatween.domain.song.entity.CopySheet;
import com.a205.beatween.domain.song.repository.CopySheetRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Slf4j
public class PlayServiceImpl implements PlayService {
    private final RedisTemplate<String, Object> redisTemplate;
    private final SimpMessagingTemplate messagingTemplate;
    private final DrawingService drawingService;
    private final CopySheetRepository copySheetRepository;

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

    @Override
    public boolean isManager(String spaceId, String sessionId) {
        String managerKey = "ws:space:" + spaceId + ":manager";
        String currentManager = (String) redisTemplate.opsForValue().get(managerKey);
        return sessionId.equals(currentManager);
    }

    @Override
    public void sendInitialManagerStatus(String userId, String spaceId, boolean isManager) {
        messagingTemplate.convertAndSendToUser(
                userId,
                "/queue/play/manager/" + spaceId,
                new ManagerStatusMessage(isManager)
        );
    }

    @Override
    public void broadcastManagerChange(String spaceId, String newManagerSessionId) {
        String userToSessionKey = "ws:space:" + spaceId + ":session:" + newManagerSessionId;
        String newManagerUserId = (String) redisTemplate.opsForValue().get(userToSessionKey);

        messagingTemplate.convertAndSend(
                "/topic/play/manager/" + spaceId,
                new ManagerChangedMessage(newManagerSessionId, newManagerUserId)
        );
    }


    @Override
    public void handleManualDisconnect(String spaceId, String sessionId, String userId) {
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

    @Override
    public Result<SheetSelectResponse> selectSheet(SheetSelectRequest req) {
        int spaceId = req.getSpaceId();
        Integer copySongId = req.getCopySongId() == 0 ? null : req.getCopySongId();
        String part = req.getInstrumentPart();
        String songKey = "ws:space:" + spaceId + ":selectedSong";

        if (copySongId != null) {
            redisTemplate.opsForValue().set(songKey, String.valueOf(copySongId));
        } else {
            String stored = (String) redisTemplate.opsForValue().get(songKey);
            if (stored == null) {
                return Result.error(404, "아직 곡이 선택되지 않았습니다.");
            }
            copySongId = Integer.parseInt(stored);
        }

        Optional<CopySheet> optionalSheet =
                copySheetRepository.findByCopySong_CopySongIdAndPart(copySongId, part);

        if (optionalSheet.isEmpty()) {
            return Result.error(404, "선택한 세션에 해당하는 악보가 존재하지 않습니다.");
        }

        CopySheet sheet = optionalSheet.get();

        SheetSelectResponse response = new SheetSelectResponse(
                sheet.getCopySheetId(),
                sheet.getPart(),
                sheet.getSheetUrl()
        );

        return Result.success(response);
    }

}


