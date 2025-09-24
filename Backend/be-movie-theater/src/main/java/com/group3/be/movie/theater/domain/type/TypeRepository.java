package com.group3.be.movie.theater.domain.type;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TypeRepository extends JpaRepository<Type, Long> {
    @Query("SELECT t FROM Type t JOIN t.movies m WHERE m.movieId = :movieId")
    List<Type> findByMovieId(@Param("movieId") Long movieId);
}
