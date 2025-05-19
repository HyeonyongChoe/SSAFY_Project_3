package com.a205.beatween.domain.song.controller;

import com.a205.beatween.common.event.SseEmitters;
import com.a205.beatween.common.reponse.ResponseDto;
import com.a205.beatween.common.reponse.Result;
import com.a205.beatween.domain.song.dto.CopySheetResponseDto;
import com.a205.beatween.domain.song.dto.UrlRequestDto;
import com.a205.beatween.domain.song.service.SongService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;

@RestController
@RequestMapping("/api/v1/spaces/{spaceId}/songs")
@RequiredArgsConstructor
public class SongController {
    private final SongService songService;
    private final SseEmitters sseEmitters;

    @GetMapping("/{songId}/categories/{categoryId}/sheets/{sheetId}")
    public ResponseEntity<ResponseDto<CopySheetResponseDto>> getSheet(
            @PathVariable("spaceId") Integer spaceId,
            @PathVariable("songId") Integer songId,
            @PathVariable("categoryId") Integer categoryId,
            @PathVariable("sheetId") Integer sheetId,
            @RequestHeader("X-USER-ID") Integer userId //로그인 구현 이전 임시 헤더
    ){
        Result<CopySheetResponseDto> result = songService.getCopySheet(userId, spaceId, songId, categoryId, sheetId);
        return ResponseEntity.ok(ResponseDto.from(result));
    }

    @PostMapping("/sheets")
    public ResponseEntity<Void> createSheet(
            @PathVariable("spaceId") Integer spaceId,
            @RequestHeader("X-USER-ID") Integer userId, //로그인 구현 이전 임시 헤더
            @RequestBody UrlRequestDto urlRequestDto) {

        songService.createSheet(urlRequestDto, userId, spaceId);

        return ResponseEntity.ok().build();
    }

    @GetMapping(value = "/sheets/subscribe", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter subscribe(
            @PathVariable("spaceId") Integer spaceId,
            @RequestHeader("X-USER-ID") Integer userId) {

        SseEmitter emitter = sseEmitters.add(userId, spaceId);

        // 연결 즉시 초기 이벤트 전송
        try {
            emitter.send(SseEmitter.event()
                    .name("connect")
                    .data("SSE 연결이 설정되었습니다."));
        } catch (IOException e) {
            throw new RuntimeException("SSE 연결 실패", e);
        }

        return emitter;
    }
}
