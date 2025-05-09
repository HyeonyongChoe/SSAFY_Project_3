package com.a205.beatween.domain.drawing.controller;

import com.a205.beatween.domain.drawing.dto.DrawingUpdateMessage;
import com.a205.beatween.domain.drawing.service.DrawingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
@Slf4j
public class DrawingSocketController {

    private final DrawingService drawingService;
    private final SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/draw")
    public void handleDraw(DrawingUpdateMessage message) {
        drawingService.updateDrawing(message);
        messagingTemplate.convertAndSend("/topic/draw/" + message.getSheetId(), message);
    }
}
