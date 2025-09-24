package com.group3.be.movie.theater.domain.schedule;

import com.group3.be.movie.theater.domain.schedule.schedule_dto.*;
import com.group3.be.movie.theater.util.annotation.APIMessage;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1/schedules")
@AllArgsConstructor
public class ScheduleController {

    private final ScheduleService scheduleService;

    // Add a single schedule
    @APIMessage("Add Schedules of a showdate")
    @PostMapping("/add")
    public ResponseEntity<List<Schedule>> addSchedule(@RequestBody ReqAddScheduleDTO request) {
        List<Schedule> schedules = scheduleService.addSchedulesByShowDate(request.getScheduleTimes(), request.getShowDateId());
        return ResponseEntity.ok(schedules);
    }


    // Get all schedules for a specific show date
    @APIMessage("Get Schedlules by show date")
    @GetMapping("/show-date/{showDateId}")
    public ResponseEntity<List<Schedule>> getSchedulesByShowDate(@PathVariable Long showDateId) {
        List<Schedule> schedules = scheduleService.getSchedulesByShowDate(showDateId);
        return ResponseEntity.ok(schedules);
    }


    @APIMessage("Get Schedules by date and movies")
    @GetMapping("/movie-date")
    public ResponseEntity<List<Schedule>> getSchedulesByDateAndMovie(@RequestParam Long movieId,
                                                                     @RequestParam LocalDate date) {
        List<Schedule> list = scheduleService.getSchedulesByDateAndMovie(movieId, date);
        return ResponseEntity.ok(list);
    }

    @APIMessage("Get schedules by id")
    @GetMapping
    public ResponseEntity<ResScheduleDTO> getScheduleById(@RequestParam Long scheduleId) {
        return ResponseEntity.ok().body(scheduleService.findByScheduleId(scheduleId));
    }

    @APIMessage("Delete Schedules by show date")
    @DeleteMapping("/show-date/{showDateId}")
    public ResponseEntity<String> deleteSchedulesByShowDate(@PathVariable Long showDateId) {
        String res = scheduleService.deleteByShowDate(showDateId);
        return ResponseEntity.ok(res);
    }


}
