package com.group3.be.movie.theater.util.validation.role;

import com.group3.be.movie.theater.domain.role.RoleService;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.springframework.beans.factory.annotation.Autowired;

public class RoleIdExistsValidator implements ConstraintValidator<RoleIdExists, Long> {
    @Autowired
    private RoleService roleService;

    @Override
    public boolean isValid(Long id, ConstraintValidatorContext constraintValidatorContext) {
        return roleService.isExistRoleById(id);
    }
}
