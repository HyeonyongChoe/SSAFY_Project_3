package com.a205.beatween.space.entity;

import com.a205.beatween.space.enums.SpaceType;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import java.time.LocalDateTime;

@Getter
@Builder
@Table(name = "spaces")
@Entity
public class Space {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "space_id", nullable = false)
    private Integer spaceId;

    @Column(length = 50)
    private String name;

    @Column(length = 500)
    private String description;

    @Column(name = "image_url", length = 255)
    private String imageUrl;

    @Column(name = "share_url", length = 255)
    private String shareUrl;

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false,
            columnDefinition = "ENUM('PERSONAL','TEAM') default 'PERSONAL'")
    private SpaceType spaceType = SpaceType.PERSONAL;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
