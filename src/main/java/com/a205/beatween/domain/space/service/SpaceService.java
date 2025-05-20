package com.a205.beatween.domain.space.service;

import com.a205.beatween.common.reponse.Result;
import com.a205.beatween.common.util.S3Util;
import com.a205.beatween.domain.space.dto.CreateTeamDto;
import com.a205.beatween.domain.space.dto.MemberDto;
import com.a205.beatween.domain.space.dto.SpaceDetailResponseDto;
import com.a205.beatween.domain.space.entity.Space;
import com.a205.beatween.domain.space.entity.UserSpace;
import com.a205.beatween.domain.space.enums.RoleType;
import com.a205.beatween.domain.space.enums.SpaceType;
import com.a205.beatween.domain.space.dto.SpacePreDto;
import com.a205.beatween.domain.space.repository.SpaceRepository;
import com.a205.beatween.domain.space.repository.UserSpaceRepository;
import com.a205.beatween.domain.user.entity.User;
import com.a205.beatween.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.UncheckedIOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Optional;
import java.util.UUID;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SpaceService {
    private final UserSpaceRepository userSpaceRepository;
    private final SpaceRepository spaceRepository;
    private final S3Util s3Util;
    private final UserRepository userRepository;

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
            .shareKey(shareKey)
            .spaceType(SpaceType.TEAM)
            .createdAt(LocalDateTime.now())
            .build();

        spaceRepository.save(teamspace);

        // 스페이스 이름 기반 슬러그 생성
        String slug = name
                .toLowerCase()
                .replaceAll("[^a-z0-9가-힣]+", "-")
                .replaceAll("(^-|-$)", "");

        String shareUrlWithSlug = "/share/" + slug + "/" + shareKey;

        return CreateTeamDto.builder()
            .name(name)
            .shareKey(shareUrlWithSlug)
            .build();
    }

    public Result<String> getTeamSpaceInvitationLink(Integer spaceId) {
        Space space = spaceRepository.findById(spaceId).orElse(null);
        if(space == null) {
            return Result.error(HttpStatus.NOT_FOUND.value(), "해당 spaceId에 해당하는 스페이스를 찾을 수 없습니다.");
        }

        System.out.println("스페이스 이름 : " + space.getName());


        String slug = space.getName()
                .toLowerCase()
                .replaceAll("[^a-z0-9가-힣]+", "-")
                .replaceAll("(^-|-$)", "");

        String shareUrlWithSlug = "/share/" + slug + "/" + space.getShareKey();

        return Result.<String>builder()
                .success(true)
                .data(shareUrlWithSlug)
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

        String key = "space_images/space_id/" + spaceId + contentType;
        return s3Util.upload(fileBytes, contentType, key);
    }

    public List<SpacePreDto> getSpaces(Integer userId) {
        return spaceRepository.findByUserId(userId);
    }

    public SpaceDetailResponseDto getSpaceDetail(Integer spaceId, Integer userId) {
        Space space = spaceRepository.getReferenceById(spaceId);
        UserSpace userSpace = userSpaceRepository.findBySpaceAndUser_UserId(space,userId);
        List<UserSpace> userSpaceList = userSpaceRepository.findBySpace(space);
        List<MemberDto> members = new ArrayList<>();
        for (UserSpace member : userSpaceList) {
            User user = userRepository.getReferenceById(member.getUser().getUserId());
            MemberDto memberDto = MemberDto
                    .builder()
                    .nickName(user.getNickname())
                    .profileImageUrl(user.getProfileImageUrl())
                    .build();
            members.add(memberDto);
        }
        return SpaceDetailResponseDto
                .builder()
                .spaceId(spaceId)
                .spaceName(space.getName())
                .spaceType(space.getSpaceType())
                .roleType(userSpace.getRoleType())
                .description(space.getDescription())
                .spaceType(space.getSpaceType())
                .createAt(space.getCreatedAt())
                .updateAt(space.getUpdatedAt())
                .members(members)
                .build();


    }

    public SpaceDetailResponseDto updateSpace(Integer spaceId, Integer userId, String name, String description, MultipartFile image) throws IOException {
        Space space = spaceRepository.findById(spaceId).orElse(null);
        UserSpace userSpace = userSpaceRepository.findBySpaceAndUser_UserId(space,userId);
        if(space == null || userSpace == null) {
            return null;
        }
        if(name != null) {
            space.setName(name);
        }
        if(description != null) {
            space.setDescription(description);
        }
        if(image != null) {
            String key = "space_images/si".concat(String.valueOf(spaceId)).concat(".png");
            String url = s3Util.upload(image.getBytes(),"image/png", key);
            space.setImageUrl(url);
        }
        space = spaceRepository.save(space);

        return getSpaceDetail(spaceId,userId);
    }
}