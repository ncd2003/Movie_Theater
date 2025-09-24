package com.group3.be.movie.theater.domain.invoice.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class InvoiceDTO {
    private Long bookingId;
    private Long memberId;
    private String fullName;
    private String phoneNumber;
    private String identityCard;
    private Double addScore;
    private Instant bookingDate;
    private String movieName;
    private String roomName;
    private Instant scheduleShow;
    private String scheduleShowTime;
    private String status;
    private Double totalMoney;
    private Double useScore;
    private String seat;
    private String promotion;
    private String emailMember;
}
