package com.group3.be.movie.theater.util.validation.room;

import com.group3.be.movie.theater.domain.cinema_room.CinemaRoomService;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.springframework.beans.factory.annotation.Autowired;

public class CinemaRoomIdExistsValidator implements ConstraintValidator<CinemaRoomIdExists, Long> {
    @Autowired
    private CinemaRoomService roomService;

    @Override
    public boolean isValid(Long id, ConstraintValidatorContext constraintValidatorContext) {
        return roomService.isExistRoomById(id);
    }
}
