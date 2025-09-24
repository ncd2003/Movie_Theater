package com.group3.be.movie.theater.domain.seat.dto;

import com.group3.be.movie.theater.domain.cinema_room.dto.ResCinemaRoomDTO;
import com.group3.be.movie.theater.domain.seat_status.dto.ResSeatStatusDTO;
import com.group3.be.movie.theater.domain.seat_type.dto.ResSeatTypeDTO;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ResSeatDTO {
    private ResCinemaRoomDTO resCinemaRoomDTO;
    private List<List<ResSeatDTO.SeatDTO>> seatMatrix;

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class SeatDTO {
        private Long seatId;
        private int row;
        private int col;
        private ResSeatTypeDTO resSeatTypeDTO;
        private ResSeatStatusDTO resSeatStatusDTO;
    }
}
