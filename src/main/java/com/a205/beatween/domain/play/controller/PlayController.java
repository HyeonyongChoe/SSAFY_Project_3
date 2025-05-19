package com.a205.beatween.domain.play.controller;

import com.a205.beatween.domain.play.dto.ManagerCheckResponse;
import com.a205.beatween.domain.play.dto.PlayControlMessage;
import com.a205.beatween.domain.play.service.PlayService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/play")
@RequiredArgsConstructor
public class PlayController {
    private final PlayService playService;

    @GetMapping("/state/{spaceId}")
    public ResponseEntity<PlayControlMessage> getPlayState(@PathVariable("spaceId") Integer spaceId) {
        PlayControlMessage latest = playService.getLatestState(spaceId);
        return ResponseEntity.ok(latest);
    }

    @GetMapping("/authority/manager/{spaceId}")
    public ResponseEntity<ManagerCheckResponse> checkIfManager(
            @PathVariable long spaceId,
            StompHeaderAccessor accessor
    ) {
        String sessionId = accessor.getSessionId();
        ManagerCheckResponse response = playService.checkManager(spaceId, sessionId);
        return ResponseEntity.ok(response);
    }


}
