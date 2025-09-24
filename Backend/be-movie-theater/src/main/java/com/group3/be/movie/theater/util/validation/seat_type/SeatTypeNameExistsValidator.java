package com.group3.be.movie.theater.util.validation.seat_type;

import com.group3.be.movie.theater.domain.seat_type.SeatTypeService;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.springframework.beans.factory.annotation.Autowired;

public class SeatTypeNameExistsValidator implements ConstraintValidator<SeatTypeNameExists, String> {
    @Autowired
    private SeatTypeService seatTypeService;

    @Override
    public boolean isValid(String name, ConstraintValidatorContext constraintValidatorContext) {
        return !seatTypeService.existsBySeatTypeName(name);
    }
}
