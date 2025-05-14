package com.a205.beatween.domain.drawing.controller;

import com.a205.beatween.domain.drawing.dto.DrawingPoint;
import com.a205.beatween.domain.drawing.service.DrawingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/drawings")
public class DrawingController {

    private final DrawingService drawingService;

    @GetMapping("/{sheetId}")
    public ResponseEntity<List<DrawingPoint>> getDrawings(@PathVariable int sheetId) {
        return ResponseEntity.ok(drawingService.getDrawingList(sheetId));
    }
}
