package com.group3.be.movie.theater.domain.schedule;

import com.group3.be.movie.theater.domain.show_dates.ShowDate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ScheduleRepository extends JpaRepository<Schedule, Long> {
    List<Schedule> findByShowDate_ShowDateId(Long showDateId);
    void deleteByShowDate_ShowDateIdIn(List<Long> showDateIds);

    void deleteByShowDate_ShowDateId(Long showDateId);

    List<Schedule> findByShowDate_ShowDateIdIn(List<Long> showDateIds);

    Schedule findByScheduleId(Long scheduleId);

    Optional<Object> findByShowDate_ShowDateIdAndScheduleTime(Long showDateId, LocalTime scheduleTime);
}
