package com.group3.be.movie.theater.domain.cinema_room;

import com.group3.be.movie.theater.domain.cinema_room.dto.ResCinemaRoomDTO;

public class CinemaRoomMapper {
    public static ResCinemaRoomDTO toResCinemaRoomDTO(CinemaRoom cinemaRoom) {
        ResCinemaRoomDTO resCinemaRoomDTO = new ResCinemaRoomDTO();
        resCinemaRoomDTO.setCinemaRoomId(cinemaRoom.getCinemaRoomId());
        resCinemaRoomDTO.setCinemaRoomName(cinemaRoom.getCinemaRoomName());
        resCinemaRoomDTO.setRoomSizeCol(cinemaRoom.getRoomSizeCol());
        resCinemaRoomDTO.setRoomSizeRow(cinemaRoom.getRoomSizeRow());
        return resCinemaRoomDTO;
    }
}
