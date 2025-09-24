package com.group3.be.movie.theater.util.validation.seat_type;


import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.Retention;
import java.lang.annotation.Target;

import static java.lang.annotation.ElementType.FIELD;
import static java.lang.annotation.RetentionPolicy.RUNTIME;

@Target({FIELD})
@Retention(RUNTIME)
@Constraint(validatedBy = {SeatTypeNameExistsValidator.class})
public @interface SeatTypeNameExists {
    String message() default "Seat type name already existed!";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
