package com.group3.be.movie.theater.domain.movie;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;


import java.time.LocalDate;
import java.util.List;

@Repository
public interface MovieRepository extends JpaRepository<Movie, Long> {
    boolean existsByMovieName(String movieName);

    @Query("SELECT DISTINCT m FROM Movie m " +
            "JOIN m.showDates sd " +
            "WHERE sd.showDate = :date")
    List<Movie> findMoviesByShowDate(LocalDate date);



}
