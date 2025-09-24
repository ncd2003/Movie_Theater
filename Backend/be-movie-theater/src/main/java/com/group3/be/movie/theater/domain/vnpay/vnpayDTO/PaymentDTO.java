package com.group3.be.movie.theater.domain.vnpay.vnpayDTO;

import com.group3.be.movie.theater.domain.promotion.Promotion;
import jakarta.validation.constraints.Email;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;

import java.util.List;

public abstract class PaymentDTO {
    @Builder
    @Getter
    public static class VNPayResponse {
        private String code;
        private String message;
        private String paymentUrl;
    }

    @Data
    public static class VNPayRequest {
        private Double totalMoney;
        private String movieName;
        private String roomName;
        private String scheduleShow;
        private String scheduleShowTime;
        private List<SeatDTO> seats;
        private List<PromotionDTO> promotions;
        private String emailMember;
    }

    @Data
    public static class SeatDTO {
        private String seatName;
    }

    @Data
    public static class PromotionDTO {
        private Promotion.PromotionType promotionType;
        private Double reward;
    }


}
