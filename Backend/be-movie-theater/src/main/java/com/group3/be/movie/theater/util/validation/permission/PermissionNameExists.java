package com.group3.be.movie.theater.util.validation.permission;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.Documented;
import java.lang.annotation.Retention;
import java.lang.annotation.Target;

import static java.lang.annotation.ElementType.FIELD;
import static java.lang.annotation.RetentionPolicy.RUNTIME;


@Target({FIELD})
@Retention(RUNTIME)
@Documented
@Constraint(validatedBy = {PermissionNameExistsValidator.class})

public @interface PermissionNameExists {
    String message() default "Permission name already existed!";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};

}
