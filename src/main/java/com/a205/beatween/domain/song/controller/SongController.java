package com.a205.beatween.domain.song.controller;

import com.a205.beatween.common.reponse.ApiResponse;
import com.a205.beatween.domain.song.dto.CopySheetResponseDto;
import com.a205.beatween.domain.song.service.SongService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/spaces/{spaceId}/songs")
@RequiredArgsConstructor
public class SongController {
    private final SongService songService;

    @GetMapping("/{songId}/categories/{categoryId}/sheets/{sheetId}")
    public ResponseEntity<ApiResponse<CopySheetResponseDto>> getSheet(
            @PathVariable("spaceId") Integer spaceId,
            @PathVariable("songId") Integer songId,
            @PathVariable("categoryId") Integer categoryId,
            @PathVariable("sheetId") Integer sheetId,
            @RequestHeader("X-USER-ID") Integer userId //로그인 구현 이전 임시 헤더
    ){
        ApiResponse<CopySheetResponseDto> res = songService.getCopySheet(userId, spaceId, songId, categoryId, sheetId);
        return ResponseEntity.ok(res);
    }
}
