package com.group3.be.movie.theater.util.validation.room;

import static java.lang.annotation.ElementType.PARAMETER;
import static java.lang.annotation.RetentionPolicy.RUNTIME;

import java.lang.annotation.Retention;
import java.lang.annotation.Target;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

@Target({PARAMETER})
@Retention(RUNTIME)
@Constraint(validatedBy = {CinemaRoomIdExistsValidator.class})
public @interface CinemaRoomIdExists {
    String message() default "Room id not exists!";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
