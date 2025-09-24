package com.group3.be.movie.theater.domain.movie.dto;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ResMovieDTO {
    private Long movieId;
    private String actor;
    private String movieName;
    private String director;
    private Integer duration;
    private String content;
    private Date fromDate;
    private Date toDate;
    private String movieProductionCompany;
    private String version;
    private String image;
    private String trailer;
}
