package com.a205.beatween.domain.space.controller;

import com.a205.beatween.common.reponse.Result;
import com.a205.beatween.domain.space.dto.InvitationDto;
import com.a205.beatween.domain.space.dto.CreateTeamDto;
import com.a205.beatween.domain.space.service.SpaceService;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.security.Principal;

@RestController
@RequestMapping("/api/v1/space")
@RequiredArgsConstructor
public class SpaceController {

    private final SpaceService spaceService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    public CreateTeamDto createTeamSpace(
            @RequestParam("name") @NotBlank String name,
            @RequestParam(value = "description", required = false) String description,
            @RequestPart(value = "image", required = false) MultipartFile image
    ) {
        // ResponseEntity 없이 리턴 타입을 DTO로 바로 선언
        return spaceService.createTeamSpace(name, description, image);
    }

    @GetMapping("/share/{teamSlug}/{shareKey}")
    public ResponseEntity<Result<?>> handleInvitationLink(
            @PathVariable String teamSlug,
            @PathVariable String shareKey,
            Principal principal
    ) {

        Result<InvitationDto> invitation = spaceService.resolveInvitationLink(teamSlug, shareKey, principal);

        return ResponseEntity.ok(invitation);
    }


}
