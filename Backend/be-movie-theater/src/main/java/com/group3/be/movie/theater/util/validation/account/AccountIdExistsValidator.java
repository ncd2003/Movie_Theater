package com.group3.be.movie.theater.util.validation.account;

import com.group3.be.movie.theater.domain.account.AccountService;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.springframework.beans.factory.annotation.Autowired;

public class AccountIdExistsValidator implements ConstraintValidator<AccountIdExists, Long> {
    @Autowired
    private AccountService accountService;

    @Override
    public boolean isValid(Long id, ConstraintValidatorContext constraintValidatorContext) {
        try{
            boolean result = accountService.isExistId(id);
            if(result){
                return true;
            }
        }catch (Exception e){
            return false;
        }
        return false;
    }
}
