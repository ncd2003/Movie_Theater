package com.group3.be.movie.theater.util.validation.seat;


import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.Retention;
import java.lang.annotation.Target;

import static java.lang.annotation.ElementType.PARAMETER;
import static java.lang.annotation.RetentionPolicy.RUNTIME;

@Target({PARAMETER})
@Retention(RUNTIME)
@Constraint(validatedBy = {CinemaRoomIdInSeatExistsValidator.class})
public @interface CinemaRoomIdInSeatExists {
    String message() default "Cinema room already setup!";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
