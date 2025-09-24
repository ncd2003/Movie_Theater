package com.group3.be.movie.theater.domain.cinema_room.dto;

import com.group3.be.movie.theater.util.validation.groups.OnCreate;
import com.group3.be.movie.theater.util.validation.room.CinemaRoomNameExists;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.validator.constraints.Length;

@Getter
@Setter
public class ReqCinemaRoomDTO {
    @CinemaRoomNameExists(groups = OnCreate.class)
    @NotBlank(message = "cinema room name cant be null")
    @Length(min = 1, max = 50)
    private String cinemaRoomName;

    @NotNull(message = "seat quantity cant be null")
    @Min(value = 1)
    private Integer seatQuantity;
}
