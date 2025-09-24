package com.group3.be.movie.theater.domain.seat_type;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SeatTypeRepository extends JpaRepository<SeatType, Long> {

    List<SeatType> findBySeatTypeIdNotAndActiveTrue(Long id);

    List<SeatType> findByActiveTrue();

    boolean existsBySeatTypeNameAndActiveTrue(String seatTypeName);

    boolean existsBySeatTypeIdNotAndSeatTypeNameAndActiveTrue(Long id, String seatTypeName);
}
