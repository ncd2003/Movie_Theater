package com.group3.be.movie.theater.domain.show_dates.showdate_dto;


import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReqAddRoomToShowDateDTO {

    @NotNull(message = "Show date cant be null!")
    private Long showDateId;

    @NotNull(message = "Room cant be null!")
    private Long roomId;
}
