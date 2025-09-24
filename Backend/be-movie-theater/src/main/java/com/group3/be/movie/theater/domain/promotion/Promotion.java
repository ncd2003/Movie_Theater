package com.group3.be.movie.theater.domain.promotion;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "MOVIETHEATER.PROMOTION")
public class Promotion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "PROMOTION_ID")
    private Long promotionId;

    @Column(name = "DETAIL", columnDefinition = "MEDIUMTEXT")
    private String detail;

    @Column(name = "DISCOUNT_LEVEL")
    private Integer discountLevel;

    @Enumerated(EnumType.STRING)
    @Column(name = "PROMOTION_TYPE", length = 50 , nullable = true )
    private PromotionType promotionType = PromotionType.DISCOUNT;

    @Column(name = "END_TIME")
    private LocalDateTime endTime;

    @Column(name = "IMAGE", length = 255)
    private String image;

    @Column(name = "START_TIME")
    private LocalDateTime startTime;

    @Column(name = "TITLE", length = 255)
    private String title;

    @Column(name = "ACTIVE")
    private Boolean active = true;

    @Column(name = "CREATE_AT")
    private Instant createdAt;

    @Column(name = "UPDATE_AT")
    private Instant updatedAt;

    @Column(name = "CREATE_BY")
    private String createdBy;

    @Column(name = "UPDATE_BY")
    private String updatedBy;

    public enum PromotionType {
        GIFT,
        SCORE,
        DISCOUNT,
        POINT
    }
}
