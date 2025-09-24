package com.group3.be.movie.theater.domain.schedule_seat;


import com.group3.be.movie.theater.util.SecurityUtil;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "MOVIETHEATER.SCHEDULE_SEAT")
public class ScheduleSeat {
    @Id
    @Column(name = "SCHEDULE_SEAT_ID")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long scheduleSeatId;

    @Column(name = "CINEMA_ROOM_ID")
    private Long cinemaRoomId;

    @Column(name = "SCHEDULE_ID")
    private Long scheduleId;

    @Column(name = "SHOW_DATE_ID")
    private Long showDateId;

    @Column(name = "SEAT_ID")
    private Long seatId;

    @Column(name = "SEAT_STATUS_ID")
    private Long seatStatusId;

    private Boolean active;
    @Column(name = "CREATE_AT")
    private Instant createdAt;
    @Column(name = "UPDATE_AT")
    private Instant updatedAt;
    @Column(name = "CREATE_BY")
    private String createdBy;
    @Column(name = "UPDATE_BY")
    private String updatedBy;

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
