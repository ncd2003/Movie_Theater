package com.group3.be.movie.theater.util.validation.seat_status;


import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.Retention;
import java.lang.annotation.Target;

import static java.lang.annotation.ElementType.FIELD;
import static java.lang.annotation.RetentionPolicy.RUNTIME;

@Target({FIELD})
@Retention(RUNTIME)
@Constraint(validatedBy = {SeatStatusNameExistsValidator.class})
public @interface SeatStatusNameExists {
    String message() default "Seat status name already existed!";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
