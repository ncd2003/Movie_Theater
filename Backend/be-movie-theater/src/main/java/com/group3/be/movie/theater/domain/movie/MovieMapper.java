package com.group3.be.movie.theater.domain.movie;

import com.group3.be.movie.theater.domain.movie.dto.ResMovieDTO;

import java.util.List;
import java.util.stream.Collectors;

public class MovieMapper {
    public static ResMovieDTO movieDTO(Movie movie){
        return new ResMovieDTO(
            movie.getMovieId(),
                movie.getActor(),
                movie.getMovieName(),
                movie.getDirector(),
                movie.getDuration(),
                movie.getContent(),
                movie.getFromDate(),
                movie.getToDate(),
                movie.getMovieProductionCompany(),
                movie.getVersion(),
                movie.getImage(),
                movie.getTrailer()

        );
    }
    public static List<ResMovieDTO> movieDTOList(List<Movie> movies){
        return movies.stream().map(MovieMapper::movieDTO).collect(Collectors.toList());
    }
    private Long movieId;
    private String actor;
    private String movieName;
    private String director;
    private String duration;
    private String content;
    private String fromDate;
    private String toDate;
    private String movieProductionCompany;
    private String version;
    private String largeImage;
    private String smallImage;
}
