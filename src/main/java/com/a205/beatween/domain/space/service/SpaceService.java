package com.a205.beatween.domain.space.service;

import com.a205.beatween.domain.space.repository.SpaceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SpaceService {
    private final SpaceRepository spaceRepository;

    public boolean checkUserIsMemberOfSpace(Integer userId, Integer spaceId){
        return spaceRepository.existsByUser_UserIdAndSpace_SpaceId(userId, spaceId);
    }
}