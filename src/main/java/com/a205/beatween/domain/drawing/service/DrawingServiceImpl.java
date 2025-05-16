package com.a205.beatween.domain.drawing.service;

import com.a205.beatween.domain.drawing.dto.DrawingPoint;
import com.a205.beatween.domain.drawing.dto.DrawingUpdateMessage;
import com.a205.beatween.domain.drawing.entity.Drawing;
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
     * 실시간 드로잉 포인트를 Redis에 캐시
     * @param message
     */
    @Override
    public void updateDrawing(DrawingUpdateMessage message) {
        String key = "drawings:" + message.getCopySheetId();
        DrawingPoint point = DrawingPoint.from(message);
        redisTemplate.opsForList().rightPush(key, point);
    }


    /**
     * 드로잉 캐시 → DB 저장
     * @param copySheetIds
     */
    @Override
    public void saveAllDrawings(List<Integer> copySheetIds) {
        for(Integer copySheetId : copySheetIds) {
            String redisKey = "drawings:" + copySheetId;

            List<Object> obj = redisTemplate.opsForList().range(redisKey, 0, -1);
            List<DrawingPoint> points = obj.stream()
                    .filter(DrawingPoint.class::isInstance)
                    .map(DrawingPoint.class::cast)
                    .toList();

            List<Drawing> drawings = points.stream()
                    .map(point -> Drawing.builder()
                            .copySheetId(copySheetId)
                            .x(point.getRelativeX())
                            .y(point.getRelativeY())
                            .color(point.getColor())
                            .build())
                    .toList();

            drawingRepository.saveAll(drawings);
            redisTemplate.delete(redisKey);
            log.info("드로잉 저장 완료 - copySheetId: {}, 저장된 개수: {}", copySheetId, drawings.size());
        }
    }



    /**
     * 특정 악보의 드로잉 내역 redis에서 조회
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





}
