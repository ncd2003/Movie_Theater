package com.group3.be.movie.theater.domain.movie.dto;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Data
public class ResMovieShowDate {
    private Long movieId;
    private String movieName;
    private String image;
    private Long roomId;
    private String roomName;
    private List<MovieSchedule> movieSchedules;

    @Data
    public static class MovieSchedule{
        private Long scheduleId;
        private LocalTime scheduleTime;
    }
}
