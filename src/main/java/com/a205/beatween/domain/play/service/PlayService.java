package com.a205.beatween.domain.play.service;

import com.a205.beatween.domain.play.dto.PlayControlMessage;

public interface PlayService {
    void savePlaySession(PlayControlMessage message);
    PlayControlMessage getLatestState(Integer spaceId);
}
