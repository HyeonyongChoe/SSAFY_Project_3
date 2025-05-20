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

    // 아직 팀의 멤버가 아닌 경우
    public static InvitationDto ofInviteNonMember(SpaceSummaryDto spaceSummaryDto) {
        return new InvitationDto(false, spaceSummaryDto, null);
    }

    // 팀의 멤버인 경우
    public static InvitationDto ofInviteMember(SpaceDetailDto detailDto) {
        return new InvitationDto(true, null, detailDto);
    }
}
