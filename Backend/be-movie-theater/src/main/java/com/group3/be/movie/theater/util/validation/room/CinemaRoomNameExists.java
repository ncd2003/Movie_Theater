package com.group3.be.movie.theater.util.validation.room;

import static java.lang.annotation.ElementType.*;
import static java.lang.annotation.RetentionPolicy.RUNTIME;

import java.lang.annotation.Documented;
import java.lang.annotation.Retention;
import java.lang.annotation.Target;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;


@Target({FIELD})
@Retention(RUNTIME)
@Documented
@Constraint(validatedBy = {CinemaRoomNameExistsValidator.class})

public @interface CinemaRoomNameExists {
    String message() default "Room name already existed!";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};

}
