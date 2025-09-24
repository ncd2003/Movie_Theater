package com.group3.be.movie.theater.domain.seat_status;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.group3.be.movie.theater.domain.seat.Seat;
import com.group3.be.movie.theater.util.SecurityUtil;
import com.group3.be.movie.theater.util.validation.groups.OnCreate;
import com.group3.be.movie.theater.util.validation.seat_status.SeatStatusNameExists;
import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.validator.constraints.Length;

import java.time.Instant;
import java.util.List;

@Entity
@Table(name = "MOVIETHEATER.SEAT_STATUS")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SeatStatus {
    @Id
    @Column(name = "SEAT_STATUS_ID")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long seatStatusId;

    @Column(name = "SEAT_STATUS_NAME")
    private String seatStatusName;

    @Column(name = "SEAT_STATUS_COLOR")
    private String seatStatusColour;

    @Column(name = "SEAT_STATUS_IS_SELECTABLE")
    private Boolean isSelectable = true;

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

    @OneToMany(mappedBy = "seatStatus", fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Seat> seats;

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
