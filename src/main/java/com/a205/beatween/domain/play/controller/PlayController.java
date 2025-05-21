package com.a205.beatween.domain.play.controller;

import com.a205.beatween.common.reponse.ResponseDto;
import com.a205.beatween.common.reponse.Result;
import com.a205.beatween.domain.play.dto.*;
import com.a205.beatween.domain.play.service.PlayService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    @GetMapping("/sheets/all/{spaceId}")
    public ResponseEntity<ResponseDto<List<CategoryWithSongsResponse>>> getAllSheets(@PathVariable("spaceId") Integer spaceId) {
        List<CategoryWithSongsResponse> data = playService.getAllSheets(spaceId);
        Result<List<CategoryWithSongsResponse>> result = Result.success(data);
        return ResponseEntity.ok(ResponseDto.from(result));

    }

    @PostMapping("/sheets/select")
    public ResponseEntity<ResponseDto<SheetSelectResponse>> selectSheet(@RequestBody SheetSelectRequest request) {
        Result<SheetSelectResponse> result = playService.selectSheet(request);
        return ResponseEntity.ok(ResponseDto.from(result));
    }
}
