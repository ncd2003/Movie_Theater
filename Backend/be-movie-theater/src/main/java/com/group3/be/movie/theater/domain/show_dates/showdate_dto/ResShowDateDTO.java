package com.group3.be.movie.theater.domain.show_dates.showdate_dto;

import com.group3.be.movie.theater.domain.schedule.schedule_dto.ResScheduleDTO;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ResShowDateDTO {
    private Long showDateId;
    private LocalDate showDate;
    private Long cinemaRoomId;
}
