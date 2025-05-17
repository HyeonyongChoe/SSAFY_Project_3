package com.a205.beatween.domain.space.service;

import com.a205.beatween.domain.space.repository.UserSpaceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SpaceService {
    private final UserSpaceRepository userSpaceRepository;

    public boolean checkUserIsMemberOfSpace(Integer userId, Integer spaceId){
        return userSpaceRepository.existsByUser_UserIdAndSpace_SpaceId(userId, spaceId);
    }
}