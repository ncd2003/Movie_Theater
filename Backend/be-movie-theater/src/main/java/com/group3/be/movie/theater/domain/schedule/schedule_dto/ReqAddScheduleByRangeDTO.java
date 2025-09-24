package com.group3.be.movie.theater.domain.schedule.schedule_dto;


import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ReqAddScheduleByRangeDTO {
    @NotEmpty(message = "Schedule times list can't be empty!")
    private List<LocalTime> scheduleTimes;

    @NotNull(message = "Start date can't be null!")
    @FutureOrPresent(message = "Start date must be today or in the future!")
    private LocalDate startDate;

    @NotNull(message = "End date can't be null!")
    @FutureOrPresent(message = "End date must be today or in the future!")
    private LocalDate endDate;

    @NotNull(message = "Movie ID can't be null!")
    private Long movieId;
}
