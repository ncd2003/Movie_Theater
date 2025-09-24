package com.group3.be.movie.theater.domain.seat_status;

import com.group3.be.movie.theater.domain.seat_status.dto.ReqSeatStatusDTO;
import com.group3.be.movie.theater.domain.seat_status.dto.ResSeatStatusDTO;
import com.group3.be.movie.theater.util.BaseService;
import com.group3.be.movie.theater.util.annotation.APIMessage;
import com.group3.be.movie.theater.util.error.IdInvalidException;
import com.group3.be.movie.theater.util.validation.groups.OnCreate;
import com.group3.be.movie.theater.util.validation.seat_status.SeatStatusIdExists;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/v1/seat-status")
@AllArgsConstructor
public class SeatStatusController {
    private final SeatStatusService seatStatusService;
    private final BaseService baseService;


    @GetMapping
    @APIMessage("Fetch all seat status")
    public ResponseEntity<List<SeatStatus>> getAllSeatStatus() {
        return ResponseEntity.ok().body(seatStatusService.getAllSeatStatus());
    }

    @GetMapping("/seatStatusDto")
    @APIMessage("Fetch all seat status DTO")
    public ResponseEntity<List<ResSeatStatusDTO>> getAllSeatStatusDTO() {
        return ResponseEntity.ok().body(seatStatusService.getAllSeatStatusDTO());
    }

    @PostMapping
    @APIMessage("Create a seat status")
    public ResponseEntity<SeatStatus> createSeatStatus(@Validated(OnCreate.class) @RequestBody ReqSeatStatusDTO reqSeatStatusDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(seatStatusService.createSeatStatus(reqSeatStatusDTO));
    }

    @PutMapping("/{id}")
    @APIMessage("Update a seat status")
    public ResponseEntity<SeatStatus> updateSeatStatus(@PathVariable("id") @SeatStatusIdExists Long id, @Validated @RequestBody ReqSeatStatusDTO reqSeatStatusDTO) {
        if(seatStatusService.existsBySeatStatusNameAndIdNot(reqSeatStatusDTO.getSeatStatusName(),id)) {
            throw new IdInvalidException("Seat status name already existed!");
        }
        return ResponseEntity.ok().body(seatStatusService.updateSeatStatus(id, reqSeatStatusDTO));
    }

    @DeleteMapping("/{id}")
    @APIMessage("Delete a seat status")
    public ResponseEntity<Void> deleteSeatStatus(@PathVariable("id") @SeatStatusIdExists Long id) {
        seatStatusService.deleteSeatStatus(id);
        return ResponseEntity.noContent().build();
    }
}
