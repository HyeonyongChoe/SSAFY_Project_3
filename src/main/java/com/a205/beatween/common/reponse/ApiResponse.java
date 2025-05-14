package com.a205.beatween.common.reponse;

import com.a205.beatween.exception.ErrorResponse;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class ApiResponse<T> {
    private boolean success;
    private ErrorResponse error;
    private T data;

    public static  <T> ApiResponse<T> success(T data) {
        return ApiResponse.<T>builder()
                .success(true)
                .data(data)
                .error(null)
                .build();
    }

    public static <T> ApiResponse<T> error(int code, String message) {
        return ApiResponse.<T>builder()
                .success(false)
                .error(new ErrorResponse(code, message))
                .data(null) //실패 상황이므로 무조건 null 처리
                .build();
    }
}
