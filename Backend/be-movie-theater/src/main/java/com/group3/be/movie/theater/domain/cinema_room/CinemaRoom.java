package com.group3.be.movie.theater.domain.cinema_room;


import com.fasterxml.jackson.annotation.JsonIgnore;
import com.group3.be.movie.theater.domain.seat.Seat;
import com.group3.be.movie.theater.domain.show_dates.ShowDate;
import com.group3.be.movie.theater.util.SecurityUtil;
import com.group3.be.movie.theater.util.validation.room.CinemaRoomNameExists;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.validator.constraints.Length;

import java.time.Instant;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "MOVIETHEATER.CINEMA_ROOM")
public class CinemaRoom {

    @Id
    @Column(name = "CINEMA_ROOM_ID")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long cinemaRoomId;

    @Column(name = "CINEMA_ROOM_NAME", length = 50, nullable = false)
    private String cinemaRoomName;

    @Column(name = "SEAT_QUANTITY")
    private Integer seatQuantity;

    @Column(name = "ROOM_SIZE_ROW")
    private Integer roomSizeRow = 0;

    @Column(name = "ROOM_SIZE_COL")
    private Integer roomSizeCol = 0;

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

    @OneToMany(mappedBy = "cinemaRoom", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Seat> seats;

    @OneToMany(mappedBy = "cinemaRoom", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<ShowDate> showDates;

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
