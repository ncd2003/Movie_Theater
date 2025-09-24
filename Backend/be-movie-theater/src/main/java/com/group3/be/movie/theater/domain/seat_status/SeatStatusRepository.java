package com.group3.be.movie.theater.domain.seat_status;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SeatStatusRepository extends JpaRepository<SeatStatus, Long> {

    List<SeatStatus> findByActiveTrue();

    boolean existsBySeatStatusNameAndActiveTrue(String name);

    SeatStatus findBySeatStatusId(Long seatStatusId);

    boolean existsBySeatStatusIdNotAndSeatStatusNameAndActiveTrue(Long id, String seatStatusName);
}
