package com.group3.be.movie.theater.domain.schedule.schedule_dto;


import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalTime;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ReqAddScheduleDTO {
    private List<LocalTime> scheduleTimes;
    @NotNull(message = "Show date cannot be empty")
    private Long showDateId;
}
