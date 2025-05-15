package com.a205.beatween.domain.play.dto;

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
    private long startTimestamp;
    private boolean playing;
    private Map<Integer, Double> measureMap;
    private Integer sender; // userId
}
