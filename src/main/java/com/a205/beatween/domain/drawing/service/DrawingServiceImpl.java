package com.a205.beatween.domain.drawing.service;

import com.a205.beatween.domain.drawing.dto.DrawingPoint;
import com.a205.beatween.domain.drawing.dto.DrawingUpdateMessage;
import com.a205.beatween.domain.drawing.repository.DrawingRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class DrawingServiceImpl implements DrawingService {

    private final RedisTemplate<String, Object> redisTemplate;
    private final DrawingRepository drawingRepository;
    private final ObjectMapper objectMapper = new ObjectMapper(); // JSON 직렬화용

    /**
     * 특정 악보의 드로잉 내역 DB에서 조회
     * @param sheetId
     * @return
     */
    @Override
    public List<DrawingPoint> getDrawingList(int sheetId) {
        String key = "drawings:" + sheetId;
        List<Object> rawList = redisTemplate.opsForList().range(key, 0, -1);
        return rawList.stream()
                .filter(DrawingPoint.class::isInstance)
                .map(obj -> (DrawingPoint) obj)
                .toList();
    }

    /**
     * 실시간 드로잉 point Redis에 추가 및 저장
     * @param message
     */
    @Override
    public void updateDrawing(DrawingUpdateMessage message) {
        String key = "drawings:" + message.getSheetId();
        DrawingPoint point = DrawingPoint.from(message);
        redisTemplate.opsForList().rightPush(key, point);
    }

    @Override
    public void saveAllDrawingList(int songId) {

    }

}
