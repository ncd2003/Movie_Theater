package com.group3.be.movie.theater.domain.promotion;

import com.group3.be.movie.theater.domain.promotion.dto.ResPromotionDTO;
import com.group3.be.movie.theater.util.BaseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class PromotionService {
    @Autowired
    private PromotionRepository promotionRepository;
    @Autowired
    private BaseService baseService;

    public List<ResPromotionDTO> getPromotions() {
        return promotionRepository.findByActiveTrue().stream().map((p) -> baseService.convertObjectToObject(p, ResPromotionDTO.class)).toList();
    }

    // Lấy tất cả promotions
    public List<Promotion> getAllPromotions() {
        return promotionRepository.findByActiveTrue();
    }

    // Lấy một promotion theo ID
    public Optional<Promotion> getPromotionById(Long id) {
        return promotionRepository.findById(id);
    }

    // Tạo mới một promotion
    public Promotion createPromotion(Promotion promotion) {
        return promotionRepository.save(promotion);
    }

    // Cập nhật một promotion
    public Promotion updatePromotion(Long id, Promotion promotionDetails) {
        return promotionRepository.findById(id).map(promotion -> {
            promotion.setTitle(promotionDetails.getTitle());
            promotion.setDetail(promotionDetails.getDetail());
            promotion.setDiscountLevel(promotionDetails.getDiscountLevel());
            promotion.setPromotionType(promotionDetails.getPromotionType());
            promotion.setStartTime(promotionDetails.getStartTime());
            promotion.setEndTime(promotionDetails.getEndTime());
            promotion.setImage(promotionDetails.getImage());
            promotion.setUpdatedAt(Instant.now());
            return promotionRepository.save(promotion);
        }).orElseThrow(() -> new RuntimeException("Promotion not found with ID: " + id));
    }

    // Xóa một promotion
    public void deletePromotion(Long id) {
        if (!promotionRepository.existsById(id)) {
            throw new RuntimeException("Promotion not found with ID: " + id);
        }

        Promotion promotionDB = promotionRepository.findById(id).get();
        promotionDB.setActive(false);
        promotionRepository.save(promotionDB);


    }


    public Promotion getPromotionByIdd(Long id) {
        return promotionRepository.findById(id)
                .filter(Promotion::getActive) // Chỉ lấy promotion còn active
                .orElseThrow(() -> new RuntimeException("Promotion not found with ID: " + id));
    }

    public List<ResPromotionDTO> findAllPromotionsByLocalDateTime(LocalDateTime localDateTime) {
        return promotionRepository.findByStartTimeLessThanEqualAndEndTimeGreaterThanEqual(localDateTime,localDateTime).stream().map((p) -> baseService.convertObjectToObject(p, ResPromotionDTO.class)).toList();
    }

}
