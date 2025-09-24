package com.group3.be.movie.theater.domain.seat_status.dto;

import com.group3.be.movie.theater.util.validation.groups.OnCreate;
import com.group3.be.movie.theater.util.validation.groups.OnUpdate;
import com.group3.be.movie.theater.util.validation.seat_status.SeatStatusNameExists;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.validator.constraints.Length;

@Getter
@Setter
public class ReqSeatStatusDTO {
    @NotNull(groups = {OnUpdate.class}, message = "Seat status ID can't be null")
    private Long id;

    @NotBlank(message = "Seat status name cant be null")
    @Length(min = 1, max = 50)
    @SeatStatusNameExists(groups = OnCreate.class)
    private String seatStatusName;

    @NotBlank(message = "Seat status colour cant be null")
    private String seatStatusColour;
    private Boolean isSelectable = true;
}
