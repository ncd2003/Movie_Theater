package com.group3.be.movie.theater.util.validation.role;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.Retention;
import java.lang.annotation.Target;

import static java.lang.annotation.ElementType.PARAMETER;
import static java.lang.annotation.RetentionPolicy.RUNTIME;

@Target({PARAMETER})
@Retention(RUNTIME)
@Constraint(validatedBy = {RoleIdExistsValidator.class})
public @interface RoleIdExists {
    String message() default "Role id not exists!";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
