package com.group3.be.movie.theater.domain.schedule_seat;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ScheduleSeatRepository extends JpaRepository<ScheduleSeat, Long> {
    List<ScheduleSeat> findByCinemaRoomIdAndScheduleIdAndShowDateId(Long roomId, Long scheduleId, Long showDateId);
    boolean existsByCinemaRoomId(Long roomId);
    long countByScheduleId(Long scheduleId);
}
