package com.a205.beatween.domain.song.service;

import com.a205.beatween.common.event.SseEmitters;
import com.a205.beatween.common.reponse.Result;
import com.a205.beatween.common.util.S3Util;
import com.a205.beatween.domain.song.dto.CopySheetResponseDto;
import com.a205.beatween.domain.song.dto.CreateSheetResponseDto;
import com.a205.beatween.domain.song.dto.UrlRequestDto;
import com.a205.beatween.domain.song.entity.CopySheet;
import com.a205.beatween.domain.song.entity.CopySong;
import com.a205.beatween.domain.song.entity.OriginalSheet;
import com.a205.beatween.domain.song.entity.OriginalSong;
import com.a205.beatween.domain.song.repository.CopySheetRepository;
import com.a205.beatween.domain.song.repository.CopySongRepository;
import com.a205.beatween.domain.song.repository.OriginalSheetRepository;
import com.a205.beatween.domain.song.repository.OriginalSongRepository;
import com.a205.beatween.domain.space.entity.Category;
import com.a205.beatween.domain.space.entity.Space;
import com.a205.beatween.domain.space.repository.CategoryRepository;
import com.a205.beatween.domain.space.repository.SpaceRepository;
import com.a205.beatween.domain.space.service.SpaceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
public class SongService {
    private final CopySheetRepository copySheetRepository;
    private final CategoryRepository categoryRepository;
    private final CopySongRepository copySongRepository;

    private final SpaceService spaceService;
    private final WebClient webClient = WebClient.create();
    private final OriginalSongRepository originalSongRepository;
    private final SpaceRepository spaceRepository;
    private final OriginalSheetRepository originalSheetRepository;
    private final S3Util s3Util;
    private final SseEmitters sseEmitters;


    public Result<CopySheetResponseDto> getCopySheet(Integer userId, Integer spaceId, Integer songId, Integer categoryId, Integer sheetId){
        boolean isMember = spaceService.checkUserIsMemberOfSpace(userId, spaceId);
        if(!isMember) {
            return Result.error(HttpStatus.FORBIDDEN.value(), "요청한 사용자가 해당 밴드의 멤버가 아닙니다.");
        }

        boolean isCategoryInSpace = categoryRepository.existsByCategoryIdAndSpace_SpaceId(categoryId, spaceId);
        if (!isCategoryInSpace) {
            return Result.error(HttpStatus.BAD_REQUEST.value(), "요청한 카테고리는 해당 밴드에 속하지 않습니다.");
        }

        boolean isSongInCategory = copySongRepository.existsByCopySongIdAndCategory_CategoryId(songId, categoryId);
        if (!isSongInCategory) {
            return Result.error(HttpStatus.BAD_REQUEST.value(), "선택한 곡은 해당 카테고리에 존재하지 않습니다.");
        }

        CopySheet sheet = copySheetRepository
                .findByCopySheetIdAndCopySong_CopySongId(sheetId, songId)
                .orElse(null); //값이 없다면(not found) null

        if (sheet == null) {
            return Result.error(HttpStatus.NOT_FOUND.value(), "선택한 악보를 찾을 수 없습니다.");
        }

        return Result.success(CopySheetResponseDto.from(sheet));
    }

    @Async
    @Transactional
    public String createSheet(UrlRequestDto urlRequestDto, Integer userId, Integer spaceId) {
        // 처리 시작 이벤트 전송
        sseEmitters.send(userId, spaceId, "process", "악보 변환을 시작합니다.");

        String[][] parts = new String[4][2];
        parts[0][0] = "drum";
        parts[1][0] = "guitar";
        parts[2][0] = "vocal";
        parts[3][0] = "bass";

        OriginalSong checkSong = originalSongRepository.findByYoutubeUrl(urlRequestDto.getYoutubeUrl());
        if(checkSong != null) {
            CopySong copySong = insertCopySong(checkSong, spaceId);

            // S3에 복사본을 만들어서 올려야함
            for(String[] part : parts) {
                OriginalSheet checkSheet = originalSheetRepository.findBySongAndPart(checkSong, part[0]);
                insertCopySheet(copySong, part[0], checkSheet.getSheetUrl());
            }

            // 작업 완료 이벤트 전송;
            sseEmitters.send(userId, spaceId, "complete", copySong);
            return "악보 생성 중입니다.";
        }
        // FastAPI 호출
        callFastApi(urlRequestDto)
        .subscribe(
                response -> {
                    try {

                        System.out.println("FastAPI 응답: " + response);

                        parts[0][1] = response.getDrumUrl();
                        parts[1][1] = response.getGuitarUrl();
                        parts[2][1] = response.getGuitarUrl();
                        parts[3][1] = response.getBassUrl();

                        OriginalSong originalSong = insertOriginalSong(response);
                        for(String[] part : parts) {
                            insertOriginalSheet(originalSong,part[0], part[1]);
                        }

                        CopySong copySong = insertCopySong(originalSong, spaceId);

                        // S3에 복사본을 만들어서 올려야함
                        for(String[] part : parts) {
                            insertCopySheet(copySong, part[0], part[1]);
                        }
                        // 최종 완료 이벤트와 함께 결과 데이터 전송
                        sseEmitters.send(userId, spaceId, "complete", response);
                    } catch (Exception e) {
                        sseEmitters.send(userId, spaceId, "error", "악보 처리 중 오류 발생: " + e.getMessage());
                    }
                },
                error -> {
                    sseEmitters.send(userId, spaceId, "error", "FastAPI 호출 실패: " + error.getMessage());
                    System.err.println("FastAPI 호출 실패: " + error.getMessage());

                }
        );

        return "악보 생성 중입니다.";
    }

    private Mono<CreateSheetResponseDto> callFastApi(UrlRequestDto urlRequestDto) {
        String fastApiUrl = "http://localhost:8000/ai/transcription";
        return webClient.post()
                .uri(fastApiUrl)
                .bodyValue(urlRequestDto)  // FastAPI 요청 DTO
                .retrieve()
                .bodyToMono(CreateSheetResponseDto.class);  // FastAPI 응답 타입에 맞게 수정
    }

    private OriginalSong insertOriginalSong(CreateSheetResponseDto createSheetResponseDto) {

        OriginalSong originalSong = OriginalSong
                .builder()
                .title(createSheetResponseDto.getTitle())
                .youtubeUrl(createSheetResponseDto.getYoutubeUrl())
                .thumbnailUrl(createSheetResponseDto.getThumbnailUrl())
                .bpm(createSheetResponseDto.getBpm())
                .totalMeasures(createSheetResponseDto.getTotalMeasures())
                .build();

        return originalSongRepository.save(originalSong);
    }

    private CopySong insertCopySong(OriginalSong originalSong, Integer spaceId) {
        Space space = spaceRepository.getReferenceById(spaceId);
        Category category = categoryRepository.getCategoryByNameAndSpace("기본", space);

        CopySong copySong = CopySong
                .builder()
                .originalSong(originalSong)
                .category(category)
                .title(originalSong.getTitle())
                .thumbnailUrl(originalSong.getThumbnailUrl())
                .build();

        return copySongRepository.save(copySong);
    }

    private OriginalSheet insertOriginalSheet(OriginalSong originalSong, String part, String sheetUrl) {
        OriginalSheet originalSheet = OriginalSheet
                .builder()
                .song(originalSong)
                .part(part)
                .sheetUrl(sheetUrl)
                .build();

        return originalSheetRepository.save(originalSheet);
    }

    private CopySheet insertCopySheet(CopySong copySong, String part, String sheetUrl) {
        String newName = "copy_sheets/s".concat(String.valueOf(copySong.getCopySongId())).concat(part).concat(".musicxml");

        String copyUrl = s3Util.copyFromUrl(sheetUrl, newName);

        CopySheet copySheet = CopySheet
                .builder()
                .copySong(copySong)
                .part(part)
                .sheetUrl(copyUrl)
                .build();

        return copySheetRepository.save(copySheet);
    }
}
