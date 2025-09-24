package com.group3.be.movie.theater.domain.seat_type;

import com.group3.be.movie.theater.domain.seat_type.dto.ResSeatTypeDTO;

public class SeatTypeMapper {
    public static ResSeatTypeDTO toSeatTypeDTO(SeatType seatType){
        ResSeatTypeDTO resSeatTypeDTO = new ResSeatTypeDTO();
        resSeatTypeDTO.setSeatTypeId(seatType.getSeatTypeId());
        resSeatTypeDTO.setSeatTypeName(seatType.getSeatTypeName());
        resSeatTypeDTO.setSeatTypeColour(seatType.getSeatTypeColour());
        resSeatTypeDTO.setSeatTypePrice(seatType.getSeatTypePrice());
        return resSeatTypeDTO;
    }
}
