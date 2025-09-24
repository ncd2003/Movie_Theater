package com.group3.be.movie.theater.util.validation.account;

import com.group3.be.movie.theater.domain.account.AccountService;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.springframework.beans.factory.annotation.Autowired;

public class AccountPhoneNumberNotExistsValidator implements ConstraintValidator<AccountPhoneNumberNotExists, String> {
    @Autowired
    private AccountService accountService;

    @Override
    public boolean isValid(String phoneNumber, ConstraintValidatorContext constraintValidatorContext) {
        return !accountService.isExistPhoneNumber(phoneNumber);
    }
}
