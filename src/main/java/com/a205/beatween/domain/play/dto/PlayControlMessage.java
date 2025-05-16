package com.a205.beatween.domain.play.dto;

import com.a205.beatween.domain.play.enums.PlayStatus;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.Map;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PlayControlMessage {
    private Integer spaceId;
    private int bpm;
    private long startTimestamp; // 시작 시각
    private PlayStatus playStatus;
    private int currentMeasure; //현재 마디
    private double positionInMeasure; // 마디에서의 경과 시간
    private Integer sender; // userId
}
