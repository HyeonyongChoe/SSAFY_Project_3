package com.a205.beatween.domain.play.controller;

import com.a205.beatween.common.reponse.ResponseDto;
import com.a205.beatween.common.reponse.Result;
import com.a205.beatween.domain.play.dto.PlayControlMessage;
import com.a205.beatween.domain.play.service.PlayService;
import com.a205.beatween.domain.space.service.SpaceService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
@Slf4j
public class PlaySocketController {
    private final PlayService playService;
    private final SpaceService spaceService;
    private final SimpMessagingTemplate messagingTemplate;

    /**
     * 웹소켓 메시지 수신 시 권한 체크 후 저장 및 브로드캐스트
     *
     * @param message PlayControlMessage (sender 필드에 userId 포함)
     */
    @MessageMapping("/play/update")
    public void updatePlayState(PlayControlMessage message) {
        Integer userId = message.getSender();
        Integer spaceId = message.getSpaceId();

        if(userId == null || spaceId == null) {
            sendError(userId, 400, "사용자 id 혹은 밴드 id가 누락되었습니다.");
            return; // 권한이 없는 요청 차단
        }

        // 권한 확인
        boolean isMember = spaceService.checkUserIsMemberOfSpace(userId, spaceId);
        if (!isMember) {
            sendError(userId, 403, "해당 밴드에 대한 접근 권한이 없습니다.");
            return; // 접근 차단
        }

        //저장
        playService.savePlaySession(message);
        //브로드캐스트
        String topic = "/topic/play/session/" + message.getSpaceId();
        messagingTemplate.convertAndSend(topic, message);
    }

    /**
     * WebSocket 에러 응답을 사용자 전용 큐로 전송
     *
     * @param userId  사용자 ID
     * @param code    에러 코드
     * @param message 에러 메시지
     */
    private void sendError(Integer userId, int code, String message) {
        if (userId == null) return; // fallback

        Result<Object> result = Result.error(code, message);
        ResponseDto<Object> response = ResponseDto.from(result);

        messagingTemplate.convertAndSend("/topic/errors/" + userId, response);
    }
}
