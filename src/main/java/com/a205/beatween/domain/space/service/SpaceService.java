package com.a205.beatween.domain.space.service;

import com.a205.beatween.common.reponse.Result;
import com.a205.beatween.common.util.S3Util;
import com.a205.beatween.domain.space.dto.InvitationDto;
import com.a205.beatween.domain.space.dto.CreateTeamDto;
import com.a205.beatween.domain.space.dto.SpaceDetailDto;
import com.a205.beatween.domain.space.dto.SpaceSummaryDto;
import com.a205.beatween.domain.space.entity.Space;
import com.a205.beatween.domain.space.enums.SpaceType;
import com.a205.beatween.domain.space.repository.SpaceRepository;
import com.a205.beatween.domain.space.repository.UserSpaceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.UncheckedIOException;
import java.security.Principal;
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
        String slug = getSlug(name);

        String shareUrlWithSlug = "/share/" + slug + "/" + shareKey;

        return CreateTeamDto.builder()
            .name(name)
            .share_url(shareUrlWithSlug)
            .build();
    }

    public Result<InvitationDto> resolveInvitationLink(String teamSlug, String shareKey, Principal principal) {

        // 유저Id 확인
        //TODO : 로그인 구현 후 주석 해제
//      Integer userId = getUserId(principal);
        Integer userId = 2; // 임시 유저 id

        // shareKey로 Space 조회. 만약 이 shareKey로 space를 찾을 수 없다면 잘못된 초대 링크임
        Space space = spaceRepository.findByShareKey(shareKey).orElse(null);
        if(space == null) {
            return Result.error(HttpStatus.NOT_FOUND.value(), "잘못된 초대 링크입니다.");
        }

        // 팀 슬러그 검증. 슬러그가 실제 팀 이름으로 생성된 값이 아니라면 조작된 값이므로 잘못된 요청임
        String expectedSlug = getSlug(space.getName());

        if (!teamSlug.equals(expectedSlug)) {
            return Result.error(HttpStatus.BAD_REQUEST.value(), "잘못된 초대 링크입니다.");
        }

        // 현재 유저가 이 팀에 속해있는지 확인
        Integer spaceId = space.getSpaceId();
        boolean isMember = userSpaceRepository.existsByUser_UserIdAndSpace_SpaceId(userId, spaceId);

        // 만약 유저가 팀에 속해있지 않다면, 초대 링크에 필요한 최소한의 정보만 반환
        if(!isMember) {
            SpaceSummaryDto spaceSummaryDto = SpaceSummaryDto.builder()
                    .spaceName(space.getName())
                    .build();
            return Result.success(InvitationDto.ofInviteNonMember(spaceSummaryDto));
        }

        // 만약 유저가 이미 팀에 속해 있다면, 해당 팀 스페이스의 모든 정보 반환
        // TODO: SpaceDetailDto를 실제로 구현해야 함
        SpaceDetailDto spaceDetailDto = null;
        return Result.success(InvitationDto.ofInviteMember(spaceDetailDto));



        // 이후 로직 : isMember가 true라면 프론트에서 space 정보 바로 보여줌, 만약 아니라면 가입하시겠습니까 모달 띄움,
        // 예 클릭하면 space 정보 보여줌, POST 요청으로 가입 요청
        // 아니오 클릭하면 모달 닫고 아무것도 안함
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

    public String getSlug(String teamName) {
        return teamName
                .toLowerCase()
                .replaceAll("[^a-z0-9]+", "-")
                .replaceAll("(^-|-$)", "");
    }
}