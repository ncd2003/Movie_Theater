package com.group3.be.movie.theater.util.validation.auth;
import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import java.lang.annotation.*;
@Documented
@Constraint(validatedBy = PhoneNumberValidValidator.class)
@Target({ElementType.FIELD, ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
public @interface PhoneNumberValid {
    String message() default "The phone number is not valid";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
