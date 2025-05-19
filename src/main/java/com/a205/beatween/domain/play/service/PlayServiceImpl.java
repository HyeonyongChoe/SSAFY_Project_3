package com.a205.beatween.domain.play.service;

import com.a205.beatween.domain.play.dto.ManagerCheckResponse;
import com.a205.beatween.domain.play.dto.PlayControlMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class PlayServiceImpl implements PlayService {
    private final RedisTemplate<String, Object> redisTemplate;

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
    public ManagerCheckResponse checkManager(long spaceId, String sessionId) {
        String managerKey = "ws:space:" + spaceId + ":manager";
        Object stored = redisTemplate.opsForValue().get(managerKey);
        boolean isManager = sessionId.equals(stored);
        return new ManagerCheckResponse(isManager);
    }


}
