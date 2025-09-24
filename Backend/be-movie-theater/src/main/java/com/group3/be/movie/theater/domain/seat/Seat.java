package com.group3.be.movie.theater.domain.seat;

import com.group3.be.movie.theater.domain.cinema_room.CinemaRoom;
import com.group3.be.movie.theater.domain.seat_status.SeatStatus;
import com.group3.be.movie.theater.domain.seat_type.SeatType;
import com.group3.be.movie.theater.util.SecurityUtil;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

@Entity
@Table(name = "MOVIETHEATER.SEAT")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Seat {
    @Id
    @Column(name = "SEAT_ID")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long seatId;

    @Column(name = "SEAT_COLUMN")
    private Integer seatColumn;

    @Column(name = "SEAT_ROW")
    private Integer seatRow;

    @Column(name = "CREATE_AT")
    private Instant createdAt;
    @Column(name = "UPDATE_AT")
    private Instant updatedAt;
    @Column(name = "CREATE_BY")
    private String createdBy;
    @Column(name = "UPDATE_BY")
    private String updatedBy;

    @ManyToOne
    @JoinColumn(name = "SEAT_TYPE", nullable = false)
    private SeatType seatType;

    @ManyToOne
    @JoinColumn(name = "CINEMA_ROOM", nullable = false)
    private CinemaRoom cinemaRoom;

    @ManyToOne
    @JoinColumn(name = "SEAT_STATUS", nullable = false)
    private SeatStatus seatStatus;

    @PrePersist
    public void handleBeforeCreateAt(){
        this.createdBy = SecurityUtil.getCurrentUserLogin().isPresent() ? SecurityUtil.getCurrentUserLogin().get() : null;
        this.createdAt = Instant.now();
    }

    @PreUpdate
    public void handleBeforeUpdateAt(){
        this.updatedBy = SecurityUtil.getCurrentUserLogin().isPresent() ? SecurityUtil.getCurrentUserLogin().get() : null;
        this.updatedAt = Instant.now();
    }

}

