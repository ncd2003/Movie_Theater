package com.group3.be.movie.theater.domain.invoice;

import com.group3.be.movie.theater.domain.account.Account;
import com.group3.be.movie.theater.util.SecurityUtil;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.Date;

@Entity
@Table(name = "MOVIETHEATER.INVOICE")
@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Invoice {
    @Id
    @Column(name = "INVOICE_ID")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long invoiceId;

    @Column(name = "ADD_SCORE")
    private Double addScore;

    @Column(name = "BOOKING_DATE")
    private Instant bookingDate;

    @Column(name = "MOVIE_NAME", length = 255)
    private String movieName;

    @Column(name = "ROOM_NAME", length = 255)
    private String roomName;

    @Column(name = "SCHEDULE_SHOW")
    private Instant scheduleShow;

    @Column(name = "SCHEDULE_SHOW_TIME", length = 255)
    private String scheduleShowTime;

    @Column(name = "STATUS")
    @Enumerated(EnumType.STRING)
    private Invoice.Status status = Status.PENDING;

    @Column(name = "TOTAL_MONEY")
    private Double totalMoney;

    @Column(name = "USE_SCORE")
    private Double useScore;

    @Column(name = "SEAT", length = 255)
    private String seat;

    @Column(name = "PROMOTION", length = 100)
    private String promotion;

    @Column(name = "EMAIL_MEMBER", length = 50)
    private String emailMember;

    @Column(name = "CREATE_AT")
    private Instant createdAt;

    @Column(name = "CREATE_BY")
    private String createdBy;

    public enum Status {
        PENDING, SUCCESS, FAILED
    }

    @Column(name = "ORDER_ID", length = 255)
    private String orderId;

    @ManyToOne
    @JoinColumn(name = "ACCOUNT_ID", nullable = false)
    private Account account;

    @PrePersist
    public void handleBeforeCreateAt(){
        this.createdBy = SecurityUtil.getCurrentUserLogin().isPresent() ? SecurityUtil.getCurrentUserLogin().get() : null;
        this.createdAt = Instant.now();
    }


}
