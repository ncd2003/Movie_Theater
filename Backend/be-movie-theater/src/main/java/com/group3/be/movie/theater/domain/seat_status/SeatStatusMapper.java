package com.group3.be.movie.theater.domain.seat_status;

import com.group3.be.movie.theater.domain.seat_status.dto.ResSeatStatusDTO;

public class SeatStatusMapper {
    public static ResSeatStatusDTO toSeatStatusDTO(SeatStatus seatStatus){
        ResSeatStatusDTO resSeatStatusDTO = new ResSeatStatusDTO();
        resSeatStatusDTO.setSeatStatusId(seatStatus.getSeatStatusId());
        resSeatStatusDTO.setSeatStatusName(seatStatus.getSeatStatusName());
        resSeatStatusDTO.setSeatStatusColour(seatStatus.getSeatStatusColour());
        resSeatStatusDTO.setIsSelectable(seatStatus.getIsSelectable());
        return resSeatStatusDTO;
    }
}
