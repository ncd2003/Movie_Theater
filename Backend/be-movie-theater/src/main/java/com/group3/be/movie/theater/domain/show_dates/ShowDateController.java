package com.group3.be.movie.theater.domain.show_dates;

import com.group3.be.movie.theater.domain.show_dates.showdate_dto.ReqAddRoomToShowDateDTO;
import com.group3.be.movie.theater.domain.show_dates.showdate_dto.ReqAddShowDateByRangeDTO;
import com.group3.be.movie.theater.domain.show_dates.showdate_dto.ReqAddShowDateDTO;
import com.group3.be.movie.theater.domain.show_dates.showdate_dto.ResShowDateDTO;
import com.group3.be.movie.theater.util.annotation.APIMessage;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/v1/show-dates")
@AllArgsConstructor
public class ShowDateController {
    private final ShowDateService showDateService;

    @APIMessage("Add new ShowDate")
    @PostMapping
    public ResponseEntity<ResShowDateDTO> addShowDate(@RequestBody ReqAddShowDateDTO request) {
        ResShowDateDTO showDate = showDateService.addShowDate(request.getMovieId(), request.getDate());
        return ResponseEntity.ok(showDate);
    }

    @APIMessage("Add ShowDate by range")
    @PostMapping("/range")
    public ResponseEntity<String> addShowDatesAndSchedulesByRange(@RequestBody ReqAddShowDateByRangeDTO request) {
        String response = showDateService.addShowDatesAndSchedules(request.getMovieId(), request.getStartDate(), request.getEndDate(), request.getRoomId(),request.getScheduleTimes());
        return ResponseEntity.ok(response);
    }

    @APIMessage("Get ShowDate by movie")
    @GetMapping("/movie/{movieId}")
    public ResponseEntity<List<ResShowDateDTO>> getShowDateByMovie(@PathVariable Long movieId) {
        return ResponseEntity.ok(showDateService.getShowDatesByMovie(movieId));
    }

    @APIMessage("Add room to ShowDate")
    @PutMapping("/room")
    public ResponseEntity<ResShowDateDTO> addRoomToShowDate(@RequestBody ReqAddRoomToShowDateDTO request) {
        ResShowDateDTO showDate = showDateService.addRoomToShowDate(request.getShowDateId(), request.getRoomId());
        return ResponseEntity.ok(showDate);
    }

}

