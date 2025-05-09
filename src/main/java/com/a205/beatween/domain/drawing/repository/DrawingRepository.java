package com.a205.beatween.domain.drawing.repository;

import com.a205.beatween.domain.drawing.entity.Drawing;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DrawingRepository extends JpaRepository<Drawing, Integer> {

    Optional<Drawing> findByCopySheetId(Integer copySheetId);
}
