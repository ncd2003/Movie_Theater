package com.group3.be.movie.theater.util.validation.seat;

import com.group3.be.movie.theater.domain.seat.SeatService;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.springframework.beans.factory.annotation.Autowired;

public class CinemaRoomIdInSeatExistsValidator implements ConstraintValidator<CinemaRoomIdInSeatExists, Long> {
    @Autowired
    private SeatService seatService;

    @Override
    public boolean isValid(Long id, ConstraintValidatorContext constraintValidatorContext) {
        return !seatService.isExistRoomInSeat(id);
    }
}
