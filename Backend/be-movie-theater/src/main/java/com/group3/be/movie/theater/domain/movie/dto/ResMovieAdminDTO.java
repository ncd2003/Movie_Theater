package com.group3.be.movie.theater.domain.movie.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.Date;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ResMovieAdminDTO {
    private Long movieId;

    private String actor;

    private String content;

    private String director;

    private Integer duration;

    private Date fromDate;

    private Date toDate;

    private String movieProductionCompany;

    private String version;

    private String trailer;

    private String movieName;

    private String image;

    private Boolean active;

    private Instant createdAt;

    private Instant updatedAt;

    private String createdBy;

    private String updatedBy;

}
