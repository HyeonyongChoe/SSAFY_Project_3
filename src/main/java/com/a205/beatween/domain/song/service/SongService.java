package com.a205.beatween.domain.song.service;

import com.a205.beatween.common.reponse.ApiResponse;
import com.a205.beatween.domain.song.dto.CopySheetResponseDto;
import com.a205.beatween.domain.song.entity.CopySheet;
import com.a205.beatween.domain.song.repository.CopySheetRepository;
import com.a205.beatween.domain.song.repository.CopySongRepository;
import com.a205.beatween.domain.space.repository.CategoryRepository;
import com.a205.beatween.domain.space.service.SpaceService;
import com.a205.beatween.exception.BusinessException;
import com.a205.beatween.exception.ErrorCode;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SongService {
    private final CopySheetRepository copySheetRepository;
    private final CategoryRepository categoryRepository;
    private final CopySongRepository copySongRepository;

    private final SpaceService spaceService;

    public ApiResponse<CopySheetResponseDto> getCopySheet(Integer userId, Integer spaceId, Integer songId, Integer categoryId, Integer sheetId){
        boolean isMember = spaceService.checkUserIsMemberOfSpace(userId, spaceId);
        if(!isMember) {
            return ApiResponse.error(HttpStatus.FORBIDDEN.value(), "요청한 사용자가 해당 밴드의 멤버가 아닙니다.");
        }

        boolean isCategoryInSpace = categoryRepository.existsByCategoryIdAndSpace_SpaceId(categoryId, spaceId);
        if (!isCategoryInSpace) {
            return ApiResponse.error(HttpStatus.BAD_REQUEST.value(), "요청한 카테고리는 해당 밴드에 속하지 않습니다.");
        }

        boolean isSongInCategory = copySongRepository.existsByCopySongIdAndCategory_CategoryId(songId, categoryId);
        if (!isSongInCategory) {
            return ApiResponse.error(HttpStatus.BAD_REQUEST.value(), "선택한 곡은 해당 카테고리에 존재하지 않습니다.");
        }

        CopySheet sheet = copySheetRepository
                .findByCopySheetIdAndCopySong_CopySongId(sheetId, songId)
                .orElse(null); //값이 없다면(not found) null

        if (sheet == null) {
            return ApiResponse.error(HttpStatus.NOT_FOUND.value(), "선택한 악보를 찾을 수 없습니다.");
        }

        return ApiResponse.success(CopySheetResponseDto.from(sheet));
    }
}
