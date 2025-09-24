package com.group3.be.movie.theater.util.validation.account;

import static java.lang.annotation.ElementType.FIELD;
import static java.lang.annotation.RetentionPolicy.RUNTIME;

import java.lang.annotation.Retention;
import java.lang.annotation.Target;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

@Target({FIELD})
@Retention(RUNTIME)
@Constraint(validatedBy = {AccountPhoneNumberNotExistsValidator.class})
public @interface AccountPhoneNumberNotExists {
    String message() default "Phone number already existed !";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};

}
