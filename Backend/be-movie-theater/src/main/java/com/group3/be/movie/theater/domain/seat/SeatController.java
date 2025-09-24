package com.group3.be.movie.theater.domain.seat;

import com.group3.be.movie.theater.domain.cinema_room.CinemaRoom;
import com.group3.be.movie.theater.domain.cinema_room.CinemaRoomService;
import com.group3.be.movie.theater.domain.cinema_room.dto.ResCinemaRoomDTO;
import com.group3.be.movie.theater.domain.schedule_seat.ScheduleSeatService;
import com.group3.be.movie.theater.domain.seat.dto.ReqSeatDTO;
import com.group3.be.movie.theater.domain.seat.dto.ResSeatDTO;
import com.group3.be.movie.theater.util.annotation.APIMessage;
import com.group3.be.movie.theater.util.error.IdInvalidException;
import com.group3.be.movie.theater.util.validation.room.CinemaRoomIdExists;
import com.group3.be.movie.theater.util.validation.seat.CinemaRoomIdInSeatExists;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/v1/seat")
@AllArgsConstructor
public class SeatController {

    private final SeatService seatService;
    private final CinemaRoomService cinemaRoomService;
    private final ScheduleSeatService scheduleSeatService;

    @APIMessage("Display setup seats")
    @GetMapping("/{id}")
    public ResponseEntity<ResSeatDTO> displaySetupSeats(@PathVariable("id") @CinemaRoomIdExists Long roomId) {
        CinemaRoom roomDB = cinemaRoomService.fetchRoomById(roomId).get();
        // check row and col
        if (roomDB.getRoomSizeRow() == null || roomDB.getRoomSizeCol() == null) {
            throw new IdInvalidException("Room didnt setup seats");
        }
        return ResponseEntity.ok().body(seatService.handleGetAllSeats(roomDB));
    }

    @APIMessage("create setup seats")
    @PostMapping("/{id}")

    public ResponseEntity<List<Seat>> setupSeats(@PathVariable("id") @CinemaRoomIdInSeatExists Long roomId, @RequestBody ReqSeatDTO reqSeatDTO) {
        // Get cinemaRoom from db
        CinemaRoom cinemaRoomDB = cinemaRoomService.fetchRoomById(roomId).get();

        // Check if seat quantity > rows * cols
        if (reqSeatDTO.getCols() * reqSeatDTO.getRows() < cinemaRoomDB.getSeatQuantity()) {
            throw new IdInvalidException("Room with quantity " + cinemaRoomDB.getSeatQuantity() + " is greater than the multiple rows and cols");
        }

        // Update rows and cols into cinema in db
        cinemaRoomDB.setRoomSizeCol(reqSeatDTO.getCols());
        cinemaRoomDB.setRoomSizeRow(reqSeatDTO.getRows());
        cinemaRoomService.handleUpdateRowsAndCols(cinemaRoomDB);

        // Create if cinemaRoomId existed
        seatService.handleCreateSetupSeats(roomId, reqSeatDTO);
        return ResponseEntity.ok().build();
    }

    @APIMessage("Update setup seats")
    @PutMapping("/{id}")
    public ResponseEntity<Void> updateSetupSeats(@PathVariable("id") @CinemaRoomIdExists Long roomId, @RequestBody ResSeatDTO resSeatDTO) {
        seatService.handleUpdateSetupSeats(roomId, resSeatDTO);
        if(scheduleSeatService.isExistCinemaRoom(roomId)){
            throw new IdInvalidException("Cinema room already booked");
        }
        return ResponseEntity.ok().build();
    }

    @APIMessage("Check exist room in seat")
    @GetMapping("/existedRoomInSeat/{id}")
    public ResponseEntity<Boolean> isExistRoomInSeat(@PathVariable("id") Long roomId) {
        return ResponseEntity.ok().body(seatService.isExistRoomInSeat(roomId));
    }

    @APIMessage("Fetch seat by row,col and roomId")
    @GetMapping("findByRowColRoomId/{id}")
    public ResponseEntity<Seat> findSeatByRowColAndRoomId(@PathVariable("id") Long roomId, @RequestParam("row") int row, @RequestParam("col") int col) {
        return ResponseEntity.ok().body(seatService.fetchSeatByRowColAndRoomId(roomId, row, col));
    }

}
