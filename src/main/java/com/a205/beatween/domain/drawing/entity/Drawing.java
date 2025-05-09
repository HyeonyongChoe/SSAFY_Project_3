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

    @Column(name = "drawing_data", nullable = false)
    private String drawingData;
}
