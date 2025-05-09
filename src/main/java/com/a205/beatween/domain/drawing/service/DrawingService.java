package com.a205.beatween.domain.drawing.service;

import com.a205.beatween.domain.drawing.dto.DrawingPoint;
import com.a205.beatween.domain.drawing.dto.DrawingUpdateMessage;
import java.util.List;

public interface DrawingService {

    List<DrawingPoint> getDrawingList(int sheetId);

    void updateDrawing(DrawingUpdateMessage message);

    void saveAllDrawingList(int songId);


}
