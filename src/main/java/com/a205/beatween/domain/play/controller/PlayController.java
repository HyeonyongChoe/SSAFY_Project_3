package com.a205.beatween.domain.play.controller;

import com.a205.beatween.common.reponse.ResponseDto;
import com.a205.beatween.common.reponse.Result;
import com.a205.beatween.domain.play.dto.ManagerStatusMessage;
import com.a205.beatween.domain.play.dto.PlayControlMessage;
import com.a205.beatween.domain.play.dto.SheetSelectRequest;
import com.a205.beatween.domain.play.dto.SheetSelectResponse;
import com.a205.beatween.domain.play.service.PlayService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
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

    @PostMapping("/sheets/select")
    public ResponseEntity<ResponseDto<SheetSelectResponse>> selectSheet(@RequestBody SheetSelectRequest request) {
        Result<SheetSelectResponse> result = playService.selectSheet(request);
        return ResponseEntity.ok(ResponseDto.from(result));
    }
}
