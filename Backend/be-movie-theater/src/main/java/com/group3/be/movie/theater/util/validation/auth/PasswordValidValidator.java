package com.group3.be.movie.theater.util.validation.auth;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class PasswordValidValidator implements ConstraintValidator<PasswordValid, String> {

    @Override
    public boolean isValid(String password  , ConstraintValidatorContext constraintValidatorContext) {
        if(password == null || password.isEmpty()){
            return false;
        }
        return password.matches("^(?=.*[0-9])(?=.*[A-Z]).{8,}$");
    }
}
