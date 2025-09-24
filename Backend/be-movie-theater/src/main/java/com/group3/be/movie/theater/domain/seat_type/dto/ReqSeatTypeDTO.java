package com.group3.be.movie.theater.domain.seat_type.dto;

import com.group3.be.movie.theater.util.validation.groups.OnCreate;
import com.group3.be.movie.theater.util.validation.seat_type.SeatTypeNameExists;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.validator.constraints.Length;

@Getter
@Setter
public class ReqSeatTypeDTO {
    @NotBlank(message = "Seat type name cant be empty")
    @Length(min = 1, max = 50)
    @SeatTypeNameExists(groups = {OnCreate.class})
    private String seatTypeName;

    @NotBlank(message = "Seat type colour cant be empty")
    private String seatTypeColour;

    @NotNull(message = "Seat type price cant be empty")
    @Min(0)
    private Double seatTypePrice;
}
