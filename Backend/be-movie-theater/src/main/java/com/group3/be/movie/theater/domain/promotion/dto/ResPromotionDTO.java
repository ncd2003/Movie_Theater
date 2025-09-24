package com.group3.be.movie.theater.domain.promotion.dto;

import com.group3.be.movie.theater.domain.promotion.Promotion.PromotionType;
import lombok.Getter;
import lombok.Setter;


import java.time.LocalDateTime;

@Getter
@Setter
public class ResPromotionDTO {
    private Long promotionId;
    private String detail;
    private Integer discountLevel;
    private PromotionType promotionType;
    private LocalDateTime endTime;
    private String image;
    private LocalDateTime startTime;
    private String title;
}
