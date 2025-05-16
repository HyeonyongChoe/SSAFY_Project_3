package com.a205.beatween.domain.play.controller;

import com.a205.beatween.domain.play.dto.PlayControlMessage;
import com.a205.beatween.domain.play.service.PlayService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
