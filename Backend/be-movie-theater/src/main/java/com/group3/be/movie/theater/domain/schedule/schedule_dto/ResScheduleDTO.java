package com.group3.be.movie.theater.domain.schedule.schedule_dto;

import com.group3.be.movie.theater.domain.show_dates.ShowDate;
import lombok.Data;

import java.time.LocalTime;
@Data
public class ResScheduleDTO {
    private Long scheduleId;
    private LocalTime scheduleTime;
    private ShowDate showDate;
}
