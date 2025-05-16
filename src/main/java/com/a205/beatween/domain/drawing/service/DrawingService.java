package com.a205.beatween.domain.drawing.service;

import com.a205.beatween.domain.drawing.dto.DrawingPoint;
import com.a205.beatween.domain.drawing.dto.DrawingUpdateMessage;
import java.util.List;

public interface DrawingService {

    void updateDrawing(DrawingUpdateMessage message);

    List<DrawingPoint> getDrawingBySheet(int copySheetId);

    void saveAllDrawings(List<Integer> copySheetIds);


}
