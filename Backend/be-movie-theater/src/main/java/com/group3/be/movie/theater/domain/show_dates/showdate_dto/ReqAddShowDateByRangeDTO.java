package com.group3.be.movie.theater.domain.show_dates.showdate_dto;

import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ReqAddShowDateByRangeDTO {
        @NotNull(message = "Movie cant be null!")
        private Long movieId;

        @NotNull(message = "Start date cant be null!")
        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
        private LocalDate startDate;

        @NotNull(message = "End date cant be null!")
        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
        private LocalDate endDate;

        @NotNull(message = "Room cant be null!")
        private Long roomId;

        @NotNull(message = "schedules cannot be null")
        private List<LocalTime> scheduleTimes;

}
