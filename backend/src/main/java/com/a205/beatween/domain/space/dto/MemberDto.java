package com.a205.beatween.domain.space.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MemberDto {
    private String nickName;
    private String profileImageUrl;
    private LocalDateTime updateAt;
}
