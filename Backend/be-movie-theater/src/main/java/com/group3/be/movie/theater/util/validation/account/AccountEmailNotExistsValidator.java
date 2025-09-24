package com.group3.be.movie.theater.util.validation.account;

import com.group3.be.movie.theater.domain.account.AccountService;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.StringUtils;

public class AccountEmailNotExistsValidator implements ConstraintValidator<AccountEmailNotExists, String> {
    @Autowired
    private AccountService accountService;

    @Override
    public boolean isValid(String email, ConstraintValidatorContext constraintValidatorContext) {
        if (StringUtils.isEmpty(email)) {
            return true;
        }

        return !accountService.isExistEmail(email);
    }
}
