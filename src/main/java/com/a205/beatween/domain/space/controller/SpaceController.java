package com.a205.beatween.domain.space.controller;

import com.a205.beatween.common.reponse.ResponseDto;
import com.a205.beatween.domain.space.dto.SpacePreDto;
import com.a205.beatween.domain.space.service.SpaceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/spaces")
@RequiredArgsConstructor
public class SpaceController {

    private final SpaceService spaceService;

    @GetMapping("/")
    public ResponseEntity<ResponseDto<Object>> getSpaces(
            @RequestHeader("X-USER-ID") Integer userId
    ) {
        List<SpacePreDto> spacePreList = spaceService.getSpaces(userId);
        ResponseDto<Object> result = ResponseDto
                .builder()
                .success(true)
                .data(spacePreList)
                .build();
        return ResponseEntity.ok(result);
    }
}
