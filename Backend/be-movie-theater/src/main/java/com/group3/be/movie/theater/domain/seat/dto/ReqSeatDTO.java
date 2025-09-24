package com.group3.be.movie.theater.domain.seat.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ReqSeatDTO {
    @NotNull(message = "Rows cant be null!")
    @Min(value = 1, message = "Rows must be at least 1")
    private Integer rows;

    @NotNull(message = "Columns cant be null!")
    @Min(value = 1, message = "Columns must be at least 1")
    private Integer cols;

    @NotNull(message = "Seat matrix cant be null!")
    private List<List<SeatDTO>> seatMatrix;

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class SeatDTO {
        @NotNull(message = "Row cant be null")
        private Integer row;

        @NotNull(message = "Column cant be null")
        private Integer col;

        @NotNull(message = "Seat type id cant be null")
        private Long seatTypeId;

        @NotNull(message = "Seat status id cant be null")
        private Long seatStatusId;
    }
}
