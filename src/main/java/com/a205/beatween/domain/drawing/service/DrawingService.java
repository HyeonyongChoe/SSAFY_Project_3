package com.a205.beatween.domain.drawing.service;

import com.a205.beatween.domain.drawing.dto.DrawingPoint;
import com.a205.beatween.domain.drawing.dto.DrawingUpdateMessage;
import java.util.List;

public interface DrawingService {

    void updateDrawing(DrawingUpdateMessage message);



    List<DrawingPoint> getDrawingList(int sheetId);

    void saveAllDrawingList(int songId);


}
