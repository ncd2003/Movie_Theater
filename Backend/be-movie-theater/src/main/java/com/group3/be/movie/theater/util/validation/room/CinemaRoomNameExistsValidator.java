package com.group3.be.movie.theater.util.validation.room;

import com.group3.be.movie.theater.domain.cinema_room.CinemaRoomService;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.springframework.beans.factory.annotation.Autowired;

public class CinemaRoomNameExistsValidator implements ConstraintValidator<CinemaRoomNameExists, String> {
    @Autowired
    private CinemaRoomService roomService;

    @Override
    public boolean isValid(String name, ConstraintValidatorContext constraintValidatorContext) {
        return !roomService.isExistRoomByName(name);
    }
}
