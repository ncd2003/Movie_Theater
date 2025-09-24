package com.group3.be.movie.theater.util.validation.account;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import org.springframework.security.core.parameters.P;

import java.lang.annotation.Retention;
import java.lang.annotation.Target;

import static java.lang.annotation.ElementType.*;
import static java.lang.annotation.RetentionPolicy.RUNTIME;

@Target({FIELD, PARAMETER})
@Retention(RUNTIME)
@Constraint(validatedBy = {AccountIdentityCardNotExistsValidator.class})
public @interface AccountIdentityCardNotExists {
    String message() default "Identity card already existed!";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};

}
