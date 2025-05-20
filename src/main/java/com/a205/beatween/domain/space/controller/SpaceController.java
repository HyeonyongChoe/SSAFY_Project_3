package com.a205.beatween.domain.space.controller;

import com.a205.beatween.domain.space.dto.CreateTeamDto;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.a205.beatween.common.reponse.ResponseDto;
import com.a205.beatween.domain.space.dto.SpacePreDto;
import com.a205.beatween.domain.space.service.SpaceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;

import java.util.List;

@RestController
@RequestMapping("/api/v1/spaces")
@RequiredArgsConstructor
public class SpaceController {

    private final SpaceService spaceService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Validated
    @ResponseStatus(HttpStatus.CREATED)
    public CreateTeamDto createTeamSpace(
            @RequestParam("name") @NotBlank String name,
            @RequestParam(value = "description", required = false) String description,
            @RequestPart(value = "image", required = false) MultipartFile image
    ) {
        // ResponseEntity 없이 리턴 타입을 DTO로 바로 선언
        return spaceService.createTeamSpace(name, description, image);
    }


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
