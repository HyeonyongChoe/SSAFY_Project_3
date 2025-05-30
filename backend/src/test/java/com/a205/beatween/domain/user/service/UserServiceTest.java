package com.a205.beatween.domain.user.service;

import com.a205.beatween.common.util.S3Util;
import com.a205.beatween.domain.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.io.IOException;
import java.util.Optional;

public class UserServiceTest {
    private UserRepository userRepository;
    private S3Util s3Util;
    private UserService userService;

    @BeforeEach
    void setUp() {
        userRepository = Mockito.mock(UserRepository.class);
        s3Util        = Mockito.mock(S3Util.class);
        userService = new UserService(userRepository,
                null,null, null,
                null, null,
                s3Util,
                null);
    }

//    @DisplayName("userId에 해당하는 회원이 없는 경우 테스트")
//    @Test
//    void userNotFoundTest() throws IOException {
//        // given
//        int userId = 9999; // 존재하지 않는 userId
//        Mockito.when(userRepository.findById(userId))
//                .thenReturn(Optional.empty()); // 실제 조회를 하지 말고 바로 빈 Optional 반환
//
//        // when
//        userService.updateUserInfo(userId, null, null);
//
//        // then
//        Mockito.verify(userRepository, Mockito.never()) // userRepository 객체의 메서드가 한 번도 호출되지 않아야 한다
//                .save(Mockito.any()); // 어떤 매개변수가 save 메서드에 전달되더라도 호출되지 않아야 함
//    }

    @DisplayName("userId에 해당하는 회원이 없는 경우 테스트")
    @Test
    void userNotFoundTest() throws IOException {
        // given
        int userId = 9999;
        Mockito.when(userRepository.findById(userId))
                .thenReturn(Optional.empty());
        // when
        userService.updateUserInfo(userId, null, null);
        // then
        Mockito.verify(userRepository, Mockito.never()).save(Mockito.any());
    }
}
