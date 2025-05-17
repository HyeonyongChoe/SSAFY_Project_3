package com.a205.beatween.domain.space.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class InvitationDto {
    private boolean isMember;
    private SpaceSummaryDto summary;  // 모달용 최소 정보
    private SpaceDetailDto detail;  // 상세 정보

    // 비회원용
    public static InvitationDto ofInviteNonMember(SpaceSummaryDto spaceSummaryDto) {
        return new InvitationDto(false, spaceSummaryDto, null);
    }

    // 회원용
    public static InvitationDto ofInviteMember(SpaceDetailDto detail) {
        return new InvitationDto(true, null, detail);
    }
}
