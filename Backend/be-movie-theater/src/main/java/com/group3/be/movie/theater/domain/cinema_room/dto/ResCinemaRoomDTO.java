package com.group3.be.movie.theater.domain.cinema_room.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ResCinemaRoomDTO {
    private Long cinemaRoomId;
    private String cinemaRoomName;
    private Integer seatQuantity;
    private Integer roomSizeRow;
    private Integer roomSizeCol;
}
