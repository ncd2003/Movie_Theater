package com.group3.be.movie.theater.util.validation.auth;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class PhoneNumberValidValidator implements ConstraintValidator<PhoneNumberValid,String> {
    @Override
    public boolean isValid(String phoneNumber, ConstraintValidatorContext constraintValidatorContext) {
        if (phoneNumber == null || phoneNumber.length() != 11 || phoneNumber.isBlank()) {
            return false;
        }
        return phoneNumber.matches("/(84[3|5|7|8|9])+([0-9]{8})\\b/g");
    }
}
