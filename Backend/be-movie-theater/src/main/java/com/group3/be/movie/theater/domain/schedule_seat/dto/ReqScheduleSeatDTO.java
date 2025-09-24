package com.group3.be.movie.theater.domain.schedule_seat.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ReqScheduleSeatDTO {
    private Long cinemaRoomId;
    private Long showDateId;
    private Long scheduleId;
    private List<SeatDTO> seats;

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class SeatDTO {
        private Long seatId;
        private Long seatStatusId;
    }
}
