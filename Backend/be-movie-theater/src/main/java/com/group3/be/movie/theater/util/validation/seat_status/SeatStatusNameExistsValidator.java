package com.group3.be.movie.theater.util.validation.seat_status;

import com.group3.be.movie.theater.domain.seat_status.SeatStatusService;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.springframework.beans.factory.annotation.Autowired;

public class SeatStatusNameExistsValidator implements ConstraintValidator<SeatStatusNameExists, String> {
    @Autowired
    private SeatStatusService seatStatusService;

    @Override
    public boolean isValid(String name, ConstraintValidatorContext constraintValidatorContext) {
        return !seatStatusService.isExistSeatStatusByName(name);
    }
}
