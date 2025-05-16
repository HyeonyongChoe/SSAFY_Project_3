package com.a205.beatween.domain.drawing.service;

import com.a205.beatween.domain.drawing.dto.DrawingPoint;
import com.a205.beatween.domain.drawing.dto.DrawingUpdateMessage;
import com.a205.beatween.domain.drawing.entity.Drawing;
import com.a205.beatween.domain.drawing.repository.DrawingRepository;
import com.a205.beatween.domain.song.entity.CopySheet;
import com.a205.beatween.domain.song.repository.CopySheetRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class DrawingServiceImpl implements DrawingService {

    private final RedisTemplate<String, Object> redisTemplate;
    private final DrawingRepository drawingRepository;
    private final CopySheetRepository copySheetRepository;


    private String formatKey(double x, double y) {
        return "%.4f,%.4f".formatted(x, y);
    }

    /**
     * 실시간 드로잉 포인트를 Redis에 캐시
     */
    @Override
    public void updateDrawing(DrawingUpdateMessage message) {
        String key = "drawings:" + message.getCopySheetId();
        String fieldKey = formatKey(message.getRelativeX(), message.getRelativeY());

        if (message.isErase()) {
            redisTemplate.opsForHash().delete(key, fieldKey);
        } else {
            DrawingPoint point = DrawingPoint.from(message);
            redisTemplate.opsForHash().put(key, fieldKey, point);
        }
    }

    /**
     * DB + Redis 통합 드로잉 조회
     */
    @Override
    public List<DrawingPoint> getDrawingBySheet(int copySheetId) {
        CopySheet copySheet = copySheetRepository.findById(copySheetId).orElse(null);
        if (copySheet == null) return Collections.emptyList();

        List<Drawing> drawings = drawingRepository.findByCopySheet(copySheet);
        List<DrawingPoint> dbPoints = drawings.stream()
                .map(d -> DrawingPoint.builder()
                        .relativeX(d.getX())
                        .relativeY(d.getY())
                        .color(d.getColor())
                        .build())
                .toList();

        String redisKey = "drawings:" + copySheetId;
        Map<Object, Object> redisMap = redisTemplate.opsForHash().entries(redisKey);
        List<DrawingPoint> cachedPoints = redisMap.values().stream()
                .filter(DrawingPoint.class::isInstance)
                .map(DrawingPoint.class::cast)
                .toList();


        Map<String, DrawingPoint> merged = new HashMap<>();
        putAllToMap(merged, dbPoints);
        putAllToMap(merged, cachedPoints);

        return new ArrayList<>(merged.values());
    }

    /**
     * 드로잉 캐시 → 병합 후 DB 저장
     */
    @Override
    public void saveAllDrawings(List<Integer> copySheetIds) {
        for (Integer copySheetId : copySheetIds) {
            String redisKey = "drawings:" + copySheetId;

            Map<Object, Object> redisMap = redisTemplate.opsForHash().entries(redisKey);
            List<DrawingPoint> redisPoints = redisMap.values().stream()
                    .filter(DrawingPoint.class::isInstance)
                    .map(DrawingPoint.class::cast)
                    .toList();

            CopySheet copySheet = copySheetRepository.findById(copySheetId).orElse(null);
            if (copySheet == null) continue;

            List<Drawing> saved = drawingRepository.findByCopySheet(copySheet);
            List<DrawingPoint> dbPoints = saved.stream()
                    .map(d -> DrawingPoint.builder()
                            .relativeX(d.getX())
                            .relativeY(d.getY())
                            .color(d.getColor())
                            .build())
                    .toList();

            Map<String, DrawingPoint> merged = new HashMap<>();
            putAllToMap(merged, dbPoints);
            putAllToMap(merged, redisPoints);

            drawingRepository.deleteByCopySheet_CopySheetId(copySheetId);

            List<Drawing> drawings = merged.values().stream()
                    .map(p -> Drawing.builder()
                            .copySheet(copySheet)
                            .x(p.getRelativeX())
                            .y(p.getRelativeY())
                            .color(p.getColor())
                            .build())
                    .toList();

            drawingRepository.saveAll(drawings);
            redisTemplate.delete(redisKey);

            log.info("[DRAWING] 저장 완료 - copySheetId: {}, 저장된 개수: {}", copySheetId, drawings.size());
        }
    }

    private void putAllToMap(Map<String, DrawingPoint> target, List<DrawingPoint> source) {
        for (DrawingPoint p : source) {
            String key = formatKey(p.getRelativeX(), p.getRelativeY());
            target.put(key, p);
        }
    }
}
