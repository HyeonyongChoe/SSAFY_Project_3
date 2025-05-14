package com.a205.beatween.domain.drawing.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DrawingUpdateMessage {
    private int songId;
    private int sheetId;
    private double relativeX;
    private double relativeY;
    private String color;
}
