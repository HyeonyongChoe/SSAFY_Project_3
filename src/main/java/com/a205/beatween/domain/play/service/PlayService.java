package com.a205.beatween.domain.play.service;

import com.a205.beatween.common.reponse.Result;
import com.a205.beatween.domain.play.dto.*;

import java.util.List;

public interface PlayService {
    void savePlaySession(PlayControlMessage message);

    PlayControlMessage getLatestState(Integer spaceId);

    boolean isManager(String spaceId, String sessionId);

    void sendInitialManagerStatus(String userId, String spaceId, boolean isManager);

    void broadcastManagerChange(String spaceId, String newManagerSessionId);

    void handleManualDisconnect(String spaceId, String sessionId, String userId);

    List<CategoryWithSongsResponse> getAllSheets(Integer spaceId);

    Result<SheetSelectResponse> selectSheet(SheetSelectRequest request);
}
