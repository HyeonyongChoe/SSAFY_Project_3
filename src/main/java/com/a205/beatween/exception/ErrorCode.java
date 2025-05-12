package com.a205.beatween.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum ErrorCode {

    INVALID_REQUEST(HttpStatus.BAD_REQUEST, 1000, "잘못된 요청입니다."),
    NOT_FOUND_SPACE(HttpStatus.NOT_FOUND, 1001, "존재하지 않는 스페이스입니다."),
    DUPLICATE_MEMBER(HttpStatus.CONFLICT, 1002, "이미 존재하는 멤버입니다.");

    private final HttpStatus status;
    private final int code;
    private final String message;

    ErrorCode(HttpStatus status, int code, String message) {
        this.status = status;
        this.code = code;
        this.message = message;
    }
}
