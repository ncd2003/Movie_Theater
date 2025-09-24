package com.group3.be.movie.theater.util.validation.seat_status;

import com.group3.be.movie.theater.domain.seat_status.SeatStatusService;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.springframework.beans.factory.annotation.Autowired;

public class SeatStatusIdExistsValidator implements ConstraintValidator<SeatStatusIdExists, Long> {
    @Autowired
    private SeatStatusService seatStatusService;

    @Override
    public boolean isValid(Long id, ConstraintValidatorContext constraintValidatorContext) {
        return seatStatusService.isExistSeatStatusById(id);
    }
}
