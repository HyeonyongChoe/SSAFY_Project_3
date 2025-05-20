package com.a205.beatween.domain.space.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SpaceDetailDto {
    SpaceDetailResponseDto spaceDetailResponseDto;
    List<CopySongListByCategoryDto> songList;

}
