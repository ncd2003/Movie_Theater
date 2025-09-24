package com.group3.be.movie.theater.domain.seat;

import com.group3.be.movie.theater.domain.seat.dto.ResSeatDTO;
import com.group3.be.movie.theater.domain.seat_status.SeatStatusMapper;
import com.group3.be.movie.theater.domain.seat_type.SeatTypeMapper;

public class SeatMapper {
    public static ResSeatDTO.SeatDTO covertToSeatDTO(Seat seat){
        ResSeatDTO.SeatDTO seatDTO = new ResSeatDTO.SeatDTO();
        seatDTO.setSeatId(seat.getSeatId());
        seatDTO.setCol(seat.getSeatColumn());
        seatDTO.setRow(seat.getSeatRow());
        seatDTO.setResSeatTypeDTO(SeatTypeMapper.toSeatTypeDTO(seat.getSeatType()));
        seatDTO.setResSeatStatusDTO(SeatStatusMapper.toSeatStatusDTO(seat.getSeatStatus()));
        return seatDTO;
    }
}
