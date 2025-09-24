package com.group3.be.movie.theater.domain.schedule.schedule_dto;


import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

public class ReqDeleteScheduleByRangeDTO {
    @FutureOrPresent(message = "Start date must be today or in the future!")
    private LocalDate startDate;
    @FutureOrPresent(message = "End date must be today or in the future!")
    private LocalDate endDate;
    @NotNull(message = "Movie cannot be empty")
    private Long movieId;
}
