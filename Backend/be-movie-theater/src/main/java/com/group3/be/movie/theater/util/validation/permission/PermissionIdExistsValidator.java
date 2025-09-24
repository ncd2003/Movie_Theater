package com.group3.be.movie.theater.util.validation.permission;

import com.group3.be.movie.theater.domain.permession.PermissionService;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.springframework.beans.factory.annotation.Autowired;

public class PermissionIdExistsValidator implements ConstraintValidator<PermissionIdExists, Long> {
    @Autowired
    private PermissionService permissionService;

    @Override
    public boolean isValid(Long id, ConstraintValidatorContext constraintValidatorContext) {
        try{
            boolean result = permissionService.isExistPermissionById(id);
            if(result){
                return true;
            }
        }catch (Exception e){
            return false;
        }
        return false;
    }
}
