package com.a205.beatween.domain.song.repository;

import com.a205.beatween.domain.song.entity.CopySheet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CopySheetRepository extends JpaRepository<CopySheet, Integer> {
    Optional<CopySheet> findByCopySheetIdAndCopySong_CopySongId(Integer copySheetId, Integer copySongId);

    List<CopySheet> findByCopySong_CopySongId(Integer songId);
}
