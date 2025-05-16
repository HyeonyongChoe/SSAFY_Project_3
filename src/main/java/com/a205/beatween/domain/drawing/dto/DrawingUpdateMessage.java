package com.a205.beatween.domain.drawing.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DrawingUpdateMessage {
    private int copySheetId;
    private double relativeX;
    private double relativeY;
    private String color;
}
