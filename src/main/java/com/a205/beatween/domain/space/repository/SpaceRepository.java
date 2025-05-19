package com.a205.beatween.domain.space.repository;

import com.a205.beatween.domain.space.dto.SpacePreDto;
import com.a205.beatween.domain.space.entity.Space;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SpaceRepository extends JpaRepository<Space, Integer> {

    @Query("SELECT new com.a205.beatween.domain.space.dto.SpacePreDto(" +
            "s.spaceId, s.name, s.imageUrl, s.spaceType) " +
            "FROM Space as s " +
            "JOIN UserSpace us ON s.spaceId = us.space.spaceId " +
            "WHERE us.user.userId =:userId")
    List<SpacePreDto> findByUserId(Integer userId);
}
