package com.group3.be.movie.theater.util.validation.permission;

import com.group3.be.movie.theater.domain.cinema_room.CinemaRoomService;
import com.group3.be.movie.theater.domain.permession.PermissionService;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.springframework.beans.factory.annotation.Autowired;

public class PermissionNameExistsValidator implements ConstraintValidator<PermissionNameExists, String> {
    @Autowired
    private PermissionService permissionService;

    @Override
    public boolean isValid(String name, ConstraintValidatorContext constraintValidatorContext) {
        return !permissionService.isExistPermissionByPermissionName(name);
    }
}
