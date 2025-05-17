package com.a205.beatween.domain.space.service;

import com.a205.beatween.common.util.S3Util;
import com.a205.beatween.domain.space.dto.CreateTeamDto;
import com.a205.beatween.domain.space.entity.Space;
import com.a205.beatween.domain.space.enums.SpaceType;
import com.a205.beatween.domain.space.repository.SpaceRepository;
import com.a205.beatween.domain.space.repository.UserSpaceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.UncheckedIOException;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SpaceService {
    private final UserSpaceRepository userSpaceRepository;
    private final SpaceRepository spaceRepository;
    private final S3Util s3Util;

    public boolean checkUserIsMemberOfSpace(Integer userId, Integer spaceId){
        return userSpaceRepository.existsByUser_UserIdAndSpace_SpaceId(userId, spaceId);
    }

    public CreateTeamDto createTeamSpace(String name, String description, MultipartFile image) {

        String imageUrl = null;
        if(image != null) {
            imageUrl = saveTeamSpaceImageToS3WhenTeamCreation(image);
        }

        String shareKey = UUID.randomUUID().toString();

        Space teamspace = Space.builder()
            .name(name)
            .description(description)
            .imageUrl(imageUrl)
            .shareUrl(shareKey)
            .spaceType(SpaceType.TEAM)
            .createdAt(LocalDateTime.now())
            .build();

        spaceRepository.save(teamspace);

        // 스페이스 이름 기반 슬러그 생성
        String slug = name
                .toLowerCase()
                .replaceAll("[^a-z0-9]+", "-")
                .replaceAll("(^-|-$)", "");

        String shareUrlWithSlug = "/share/" + slug + "/" + shareKey;

        return CreateTeamDto.builder()
            .name(name)
            .share_url(shareUrlWithSlug)
            .build();
    }

    public String saveTeamSpaceImageToS3WhenTeamCreation(MultipartFile image) {
        byte[] fileBytes;
        try {
            fileBytes = image.getBytes();
        } catch (IOException e) {
            throw new UncheckedIOException("파일 변환 실패", e);
        }

        String contentType = image.getContentType();

        // 팀 이미지 저장 파일명에 필요한 space_Id의 최댓값을 가져옴
        Integer spaceId = spaceRepository.findMaxSpaceId()
                .orElseThrow(() -> new IllegalStateException("최대 Space ID를 찾을 수 없습니다."));
        spaceId++;

        String key = "space_images/space_id/"+spaceId+contentType;
        return s3Util.upload(fileBytes, contentType, key);
    }
}