package com.group3.be.movie.theater.domain.seat_status.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ResSeatStatusDTO {
    private Long seatStatusId;
    private String seatStatusName;
    private String seatStatusColour;
    private Boolean isSelectable;
}
