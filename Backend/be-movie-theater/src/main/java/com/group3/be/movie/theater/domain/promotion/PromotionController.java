package com.group3.be.movie.theater.domain.promotion;

import com.group3.be.movie.theater.domain.movie.Movie;
import com.group3.be.movie.theater.domain.promotion.dto.ResPromotionDTO;
import com.group3.be.movie.theater.util.annotation.APIMessage;
import com.group3.be.movie.theater.util.error.IdInvalidException;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@AllArgsConstructor
@RequestMapping("/api/v1/promotions")
public class PromotionController {
    private final PromotionService promotionService;


    @GetMapping("/client")
    public ResponseEntity<List<ResPromotionDTO>> getPromotions() {
        return ResponseEntity.ok().body(promotionService.getPromotions());
    }

    // Lấy danh sách tất cả promotions
    @GetMapping
    public List<Promotion> getAllPromotions() {
        return promotionService.getAllPromotions();
    }


    // Tạo mới một promotion
    @PostMapping
    public ResponseEntity<Promotion> createPromotion(@RequestBody Promotion promotion) {
        return ResponseEntity.status(HttpStatus.CREATED).body(promotionService.createPromotion(promotion));
    }

    // Cập nhật promotion theo ID
    @PutMapping("/{id}")
    public ResponseEntity<Promotion> updatePromotion(@PathVariable Long id, @RequestBody Promotion promotionDetails) {
        Optional<Promotion> promotionDB = promotionService.getPromotionById(id);
        if (!promotionDB.isPresent()) {
            throw new IdInvalidException("Promotion with id : " + id + " not exist!!!");
        }
        return ResponseEntity.ok().body(promotionService.updatePromotion(id, promotionDetails));
    }

    // Xóa promotion theo ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePromotion(@PathVariable Long id) {
        Optional<Promotion> promotionDB = promotionService.getPromotionById(id);
        if (!promotionDB.isPresent()) {
            throw new IdInvalidException("Promotion with id : " + id + " not exist!!!");
        }
        promotionService.deletePromotion(id);
        return ResponseEntity.noContent().build();
    }


    // Lấy 1 promotion theo ID
    @GetMapping("/client/{id}")
    public ResponseEntity<Promotion> getPromotionById(@PathVariable Long id) {
        Promotion promotion = promotionService.getPromotionByIdd(id);
        return promotion != null ? new ResponseEntity<>(promotion, HttpStatus.OK) : new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @GetMapping("/client/by-local-date-time")
    public ResponseEntity<List<ResPromotionDTO>> findAllPromotionsByLocalDateTime() {
        return ResponseEntity.ok(promotionService.findAllPromotionsByLocalDateTime(LocalDateTime.now()));
    }

}
