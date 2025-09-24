package com.group3.be.movie.theater.domain.show_dates;

import com.group3.be.movie.theater.domain.movie.Movie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface ShowDateRepository extends JpaRepository<ShowDate, Long> {

    List<ShowDate> findByMovie_MovieId(Long movieId);
    List<ShowDate> findByShowDateBetween(LocalDate startDate, LocalDate endDate);
    List<ShowDate> findByShowDateBetweenAndMovie_MovieId(LocalDate startDate, LocalDate endDate, Long movieId);

    Optional<ShowDate> findByMovie_MovieIdAndShowDate(Long movieId, LocalDate showDate);

    List<ShowDate> findByShowDateAndMovie_MovieId(LocalDate date, Long movieId);

    List<ShowDate> findByShowDate(LocalDate date);
    Optional<ShowDate> findByShowDateAndCinemaRoom_CinemaRoomIdAndShowDateIdNot(LocalDate showDate, Long cinemaRoomId, Long showDateId);

}
