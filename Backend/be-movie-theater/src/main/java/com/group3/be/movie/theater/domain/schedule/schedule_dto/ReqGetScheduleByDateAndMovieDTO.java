package com.group3.be.movie.theater.domain.schedule.schedule_dto;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ReqGetScheduleByDateAndMovieDTO {

    @NotNull(message = "Movie cannot be empty")
    private Long MovieId;

    @NotNull(message = "Date cannot be empty")
    private LocalDate date;
}
