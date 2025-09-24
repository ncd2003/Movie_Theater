package com.group3.be.movie.theater.util.validation.auth;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = PasswordValidValidator.class)
@Target({ElementType.FIELD, ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
public @interface PasswordValid {
    String message() default "The password must have at least 8 characters, a number, and an uppercase letter.";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}

