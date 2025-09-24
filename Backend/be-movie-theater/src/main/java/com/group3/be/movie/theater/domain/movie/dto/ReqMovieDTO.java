package com.group3.be.movie.theater.domain.movie.dto;

import com.group3.be.movie.theater.util.validation.movie.MovieNameExists;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReqMovieDTO {

    private Long movieId;

    @NotNull(message = "Actor can't be null!")
    @Min(value = 1, message = "Actor can't be empty!")
    private String actor;

    @MovieNameExists
    @NotNull(message = "Movie name can't be null!")
    @Min(value = 1, message = "Movie name can't be empty!")
    @Max(value = 100, message = "Movie name cannot be more than 100 characters")
    private String movieName;

    @NotNull(message = "Director can't be null!")
    @Min(value = 1, message = "Director can't be empty!")
    private String director;

    @NotNull(message = "Duration can't be null!")
    @Min(value = 1, message = "Duration must be at least 1 minute!")
    private Integer duration;

    @NotNull(message = "Content can't be null!")
    @Min(value = 1, message = "Content can't be empty!")
    private String content;

    @NotNull(message = "From date can't be null!")
    private Date fromDate;

    @NotNull(message = "To date can't be null!")
    private Date toDate;

    @NotNull(message = "Movie production company can't be null!")
    @Min(value = 1, message = "Movie production company can't be empty!")
    private String movieProductionCompany;

    @NotNull(message = "Version can't be null!")
    @Min(value = 1, message = "Version can't be empty!")
    private String version;

    @NotNull(message = "Trailer link can't be null!")
    @Min(value = 1, message = "Trailer link can't be empty!")
    private String trailer;
}
