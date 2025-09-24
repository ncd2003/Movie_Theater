package com.group3.be.movie.theater.util.validation.seat_type;

import com.group3.be.movie.theater.domain.seat_type.SeatTypeService;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.springframework.beans.factory.annotation.Autowired;

public class SeatTypeIdExistsValidator implements ConstraintValidator<SeatTypeIdExists, Long> {
    @Autowired
    private SeatTypeService seatTypeService;

    @Override
    public boolean isValid(Long id, ConstraintValidatorContext constraintValidatorContext) {
        return seatTypeService.existsById(id);
    }
}
