package com.group3.be.movie.theater.domain.schedule;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.group3.be.movie.theater.domain.movie.Movie;
import com.group3.be.movie.theater.domain.show_dates.ShowDate;
import com.group3.be.movie.theater.util.SecurityUtil;
import jakarta.persistence.*;
        import lombok.Data;

import java.time.Instant;
import java.time.LocalTime;
import java.util.List;

@Entity
@Table(name = "MOVIETHEATER.SCHEDULE")
@Data
public class Schedule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "SCHEDULE_ID")
    private Long scheduleId;

    @Column(name = "SCHEDULE_TIME")
    private LocalTime scheduleTime;

    @Column(name = "ACTIVE")
    private Boolean active;
    @Column(name = "CREATE_AT")
    private Instant createdAt;
    @Column(name = "UPDATE_AT")
    private Instant updatedAt;
    @Column(name = "CREATE_BY")
    private String createdBy;
    @Column(name = "UPDATE_BY")
    private String updatedBy;

    @ManyToOne
    @JoinColumn(name = "SHOW_DATE_ID", nullable = false)
    @JsonIgnore
    private ShowDate showDate;

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

