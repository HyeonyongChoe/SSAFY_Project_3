package com.a205.beatween.domain.drawing.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "drawings")
public class Drawing {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "drawing_id", nullable = false)
    private Integer drawingId;

    @Column(name = "copy_sheet_id", nullable = false)
    private Integer copySheetId;

    @Column(name = "x", nullable = false)
    private double x;

    @Column(name = "y", nullable = false)
    private double y;

    @Column(name = "color", nullable = false)
    private String color;
}
