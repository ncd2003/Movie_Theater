package com.group3.be.movie.theater.util.validation.movie;

import com.group3.be.movie.theater.domain.movie.MovieRepository;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class MovieNameExistsValidator implements ConstraintValidator<MovieNameExists, String> {

    @Autowired
    private MovieRepository movieRepository;

    @Override
    public boolean isValid(String movieName, ConstraintValidatorContext context) {
        if (movieName == null || movieName.trim().isEmpty()) {
            return true; // Handle @NotBlank separately
        }
        return !movieRepository.existsByMovieName(movieName);
    }
}
