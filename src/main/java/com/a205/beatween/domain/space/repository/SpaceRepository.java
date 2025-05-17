package com.a205.beatween.domain.space.repository;

import com.a205.beatween.domain.space.entity.Space;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SpaceRepository extends JpaRepository<Space, Integer> {

    @Query("SELECT MAX(s.spaceId) FROM Space s")
    Optional<Integer> findMaxSpaceId();

}
