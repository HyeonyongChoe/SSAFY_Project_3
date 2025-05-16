package com.a205.beatween.domain.space.repository;

import com.a205.beatween.domain.space.entity.UserSpace;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SpaceRepository extends JpaRepository<UserSpace, Integer> {
    boolean existsByUser_UserIdAndSpace_SpaceId(Integer userId, Integer spaceId);
}
