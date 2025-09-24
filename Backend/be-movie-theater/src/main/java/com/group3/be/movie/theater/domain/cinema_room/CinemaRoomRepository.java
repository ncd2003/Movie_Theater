package com.group3.be.movie.theater.domain.cinema_room;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CinemaRoomRepository extends JpaRepository<CinemaRoom, Long> {

    boolean existsByCinemaRoomNameAndActiveTrue(String roomName);

    boolean existsByCinemaRoomIdAndActiveTrue(Long roomId);

    boolean existsByCinemaRoomIdNotAndCinemaRoomNameAndActiveTrue(Long roomId, String cinemaRoomName);

    Optional<CinemaRoom> findByCinemaRoomIdAndActiveTrue(Long roomId);

    List<CinemaRoom> findByActiveTrue();
}
