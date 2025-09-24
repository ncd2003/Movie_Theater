package com.group3.be.movie.theater.domain.schedule_seat;

import com.group3.be.movie.theater.domain.cinema_room.CinemaRoom;
import com.group3.be.movie.theater.domain.cinema_room.CinemaRoomService;
import com.group3.be.movie.theater.domain.schedule.Schedule;
import com.group3.be.movie.theater.domain.schedule.ScheduleService;
import com.group3.be.movie.theater.domain.schedule.schedule_dto.ResScheduleDTO;
import com.group3.be.movie.theater.domain.schedule_seat.dto.ReqScheduleSeatDTO;
import com.group3.be.movie.theater.domain.schedule_seat.dto.ResScheduleSeatDTO;
import com.group3.be.movie.theater.domain.show_dates.ShowDate;
import com.group3.be.movie.theater.domain.show_dates.ShowDateService;
import com.group3.be.movie.theater.util.annotation.APIMessage;
import com.group3.be.movie.theater.util.error.IdInvalidException;
import lombok.AllArgsConstructor;
import org.springframework.data.repository.query.Param;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@RestController
@RequestMapping("api/v1/seat-schedule")
@AllArgsConstructor
public class ScheduleSeatController {
    private final ScheduleSeatService scheduleSeatService;
    private final CinemaRoomService cinemaRoomService;
    private final ScheduleService scheduleService;

    @APIMessage("Display schedule seat")
    @GetMapping("/{id}")
    public ResponseEntity<?> displayScheduleSeat(@PathVariable("id") Long roomId, @RequestParam Long reqScheduleId) {
        // check room
        if (!cinemaRoomService.isExistRoomById(roomId)) {
            throw new IdInvalidException("Cinema room with id : " + roomId + " not found to display setup seats");
        }

        // get room db
        CinemaRoom roomDB = cinemaRoomService.fetchRoomById(roomId).get();

        // get schedule db
        ResScheduleDTO scheduleDB = scheduleService.findByScheduleId(reqScheduleId);

        return ResponseEntity.ok().body(scheduleSeatService.handleGetAllScheduleSeats(roomDB, scheduleDB.getShowDate().getShowDateId(), scheduleDB.getScheduleId()));

    }

    @APIMessage("Add schedule seat")
    @PostMapping
    public ResponseEntity<Void> handleAddScheduleSeat(@RequestBody ReqScheduleSeatDTO reqScheduleSeatDTO) {
        // check room
        if (!cinemaRoomService.isExistRoomById(reqScheduleSeatDTO.getCinemaRoomId())) {
            throw new IdInvalidException("Cinema room with id : " + reqScheduleSeatDTO.getCinemaRoomId() + " not found to display setup seats");
        }
        scheduleSeatService.handleAddScheduleSeat(reqScheduleSeatDTO);
        return ResponseEntity.noContent().build();
    }


}
