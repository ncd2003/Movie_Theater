package com.group3.be.movie.theater.domain.seat_type.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

public class ResSeatTypeDTO {
    private Long seatTypeId;
    private String seatTypeName;
    private String seatTypeColour;
    private Double seatTypePrice;
}
