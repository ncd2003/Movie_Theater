package com.group3.be.movie.theater.domain.schedule;

import com.group3.be.movie.theater.domain.schedule.schedule_dto.ResScheduleDTO;
import com.group3.be.movie.theater.domain.schedule_seat.ScheduleSeatRepository;
import com.group3.be.movie.theater.domain.show_dates.ShowDate;
import com.group3.be.movie.theater.domain.show_dates.ShowDateRepository;
import com.group3.be.movie.theater.util.BaseService;
import com.group3.be.movie.theater.util.error.TimeIsBookedException;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class ScheduleService {

    private final ScheduleRepository scheduleRepository;
    private final ShowDateRepository showDateRepository;
    private final BaseService baseService;
    private final ScheduleSeatRepository scheduleSeatRepository;


    // Add a single schedule for a specific show date
    @Transactional
    public List<Schedule> addSchedulesByShowDate(List<LocalTime> scheduleTimes, Long showDateId) {
        ShowDate showDate = showDateRepository.findById(showDateId)
                .orElseThrow(() -> new IllegalArgumentException("Show date not found with ID: " + showDateId));

        List<Schedule> existingSchedules = scheduleRepository.findByShowDate_ShowDateId(showDateId);
        Set<LocalTime> existingTimes = existingSchedules.stream()
                .map(Schedule::getScheduleTime)
                .collect(Collectors.toSet());

        Set<LocalTime> newTimes = new HashSet<>(scheduleTimes);

        // Add new schedules
        List<Schedule> schedulesToAdd = newTimes.stream()
                .filter(time -> !existingTimes.contains(time))
                .map(time -> {
                    Schedule schedule = new Schedule();
                    schedule.setScheduleTime(time);
                    schedule.setActive(true);
                    schedule.setShowDate(showDate);
                    return schedule;
                })
                .collect(Collectors.toList());

        // Delete schedules that are not in the new list
        List<Schedule> schedulesToDelete = existingSchedules.stream()
                .filter(s -> !newTimes.contains(s.getScheduleTime()))
                .collect(Collectors.toList());

        for (Schedule schedule : schedulesToDelete) {
//            long seatCount = scheduleSeatRepository.countByScheduleId(schedule.getScheduleId());
//            if (seatCount == 0) {
//                scheduleRepository.delete(schedule);
//            } else {
//                throw new TimeIsBookedException("Cannot delete " + schedule.getScheduleTime() + " because the time is booked");
//            }
            deleteScheduleById(schedule.getScheduleId());
        }

        // Save newly added schedules
        List<Schedule> savedSchedules = scheduleRepository.saveAll(schedulesToAdd);

        // Return the combined list of schedules (existing that remain + newly added)
        List<Schedule> finalSchedules = existingSchedules.stream()
                .filter(s -> newTimes.contains(s.getScheduleTime())) // only keep schedules that remain
                .collect(Collectors.toList());
        finalSchedules.addAll(savedSchedules);

        return finalSchedules;
    }



    // Add multiple schedules for all show dates within a given date range for a specific movie
    @Transactional
    public List<Schedule> addSchedulesByRange(List<LocalTime> scheduleTimes, LocalDate startDate, LocalDate endDate, Long movieId) {
        List<ShowDate> showDatesInRange = showDateRepository.findByShowDateBetweenAndMovie_MovieId(startDate, endDate, movieId);
        List<Schedule> allSchedules = new ArrayList<>();

        for (ShowDate showDate : showDatesInRange) {
            List<Schedule> schedulesForDate = addSchedulesByShowDate(scheduleTimes, showDate.getShowDateId());
            allSchedules.addAll(schedulesForDate);
        }

        return allSchedules;
    }

    // Get all schedules for a specific show date
    public List<Schedule> getSchedulesByShowDate(Long showDateId) {
        return scheduleRepository.findByShowDate_ShowDateId(showDateId);
    }

    // Delete all schedules in the given date range for a specific movie
    public void deleteSchedulesByRange(LocalDate startDate, LocalDate endDate, Long movieId) {
        List<ShowDate> showDateInRange = showDateRepository.findByShowDateBetweenAndMovie_MovieId(startDate, endDate, movieId);
        List<Long> showDateIds = showDateInRange.stream()
                .map(ShowDate::getShowDateId)
                .toList();

        scheduleRepository.deleteByShowDate_ShowDateIdIn(showDateIds);

    }

    public List<Schedule> getSchedulesByDateAndMovie(Long movieId, LocalDate date){
        List<ShowDate> showDates = showDateRepository.findByShowDateAndMovie_MovieId(date, movieId);
        List<Long> showDateIds = showDates.stream()
                .map(ShowDate::getShowDateId)
                .toList();

        return scheduleRepository.findByShowDate_ShowDateIdIn(showDateIds);
    }

    public ResScheduleDTO findByScheduleId(Long scheduleId) {
        return baseService.convertObjectToObject(scheduleRepository.findByScheduleId(scheduleId), ResScheduleDTO.class);
    }

    @Transactional
    public String deleteByShowDate(long showDateId) {
        ShowDate showDate = showDateRepository.findById(showDateId)
                .orElseThrow(() -> new IllegalArgumentException("ShowDate not found with ID: " + showDateId));

        List<Schedule> schedules = scheduleRepository.findByShowDate_ShowDateId(showDateId);

        for (Schedule schedule : schedules) {
            long seatCount = scheduleSeatRepository.countByScheduleId(schedule.getScheduleId());

            if (seatCount != 0) {
                throw new TimeIsBookedException("Cannot complete action because " + schedule.getScheduleTime() + " of " + schedule.getShowDate().getShowDate() + " is booked by members");
            }

            scheduleRepository.delete(schedule);
        }

        showDate.setCinemaRoom(null);
        return "All schedules deleted for showDate " + showDate.getShowDate();
    }

    @Transactional
    public void deleteScheduleById(Long scheduleId) {
        Schedule schedule = scheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new IllegalArgumentException("Schedule not found with ID: " + scheduleId));


        long seatCount = scheduleSeatRepository.countByScheduleId(scheduleId);

        if (seatCount != 0) {
            throw new TimeIsBookedException("Cannot complete action because " + schedule.getScheduleTime() +" of "+ schedule.getShowDate().getShowDate()+" is booked by members");
        }

        scheduleRepository.delete(schedule);

    }




}
