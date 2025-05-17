package com.a205.beatween.domain.song.controller;

import com.a205.beatween.common.reponse.ResponseDto;
import com.a205.beatween.common.reponse.Result;
import com.a205.beatween.domain.song.dto.CopySheetResponseDto;
import com.a205.beatween.domain.song.dto.UrlRequestDto;
import com.a205.beatween.domain.song.service.SongService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/spaces/{spaceId}/songs")
@RequiredArgsConstructor
public class SongController {
    private final SongService songService;

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
    public ResponseEntity<String> createSheet(
            @PathVariable("spaceId") Integer spaceId,
            @RequestHeader("X-USER-ID") Integer userId, //로그인 구현 이전 임시 헤더
            @RequestBody UrlRequestDto urlRequestDto) {

        String result = songService.createSheet(urlRequestDto, userId, spaceId);
        return ResponseEntity.accepted().body(result);
    }
}
