package com.group3.be.movie.theater.util.validation.movie;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.Retention;
import java.lang.annotation.Target;

import static java.lang.annotation.ElementType.FIELD;
import static java.lang.annotation.ElementType.PARAMETER;
import static java.lang.annotation.RetentionPolicy.RUNTIME;

@Constraint(validatedBy = MovieNameExistsValidator.class)
@Target({FIELD})
@Retention(RUNTIME)
public @interface MovieNameExists {
    String message() default "Movie name already exists!";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
