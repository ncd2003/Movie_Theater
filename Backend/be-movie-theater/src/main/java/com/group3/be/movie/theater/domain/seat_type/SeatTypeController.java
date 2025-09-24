package com.group3.be.movie.theater.domain.seat_type;

import com.group3.be.movie.theater.domain.seat_type.dto.ReqSeatTypeDTO;
import com.group3.be.movie.theater.domain.seat_type.dto.ResSeatTypeDTO;
import com.group3.be.movie.theater.util.BaseService;
import com.group3.be.movie.theater.util.annotation.APIMessage;
import com.group3.be.movie.theater.util.error.IdInvalidException;
import com.group3.be.movie.theater.util.validation.groups.OnCreate;
import com.group3.be.movie.theater.util.validation.groups.OnUpdate;
import com.group3.be.movie.theater.util.validation.seat_type.SeatTypeIdExists;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/v1/seat-type")
@AllArgsConstructor
public class SeatTypeController {
    private final SeatTypeService seatTypeService;

    @GetMapping("/seatTypeDto")
    @APIMessage("Fetch all seat type DTO")
    public ResponseEntity<List<ResSeatTypeDTO>> getAllSeatTypeDTO() {
        return ResponseEntity.ok().body(seatTypeService.listAllSeatTypeDTO());
    }

    @GetMapping
    @APIMessage("Fetch all seat type")
    public ResponseEntity<List<SeatType>> getAllSeatType() {
        return ResponseEntity.ok().body(seatTypeService.listAllSeatType());
    }

    @PostMapping
    @APIMessage("Create a seat type")
    public ResponseEntity<SeatType> createSeatType(@Validated(OnCreate.class) @RequestBody ReqSeatTypeDTO reqSeatTypeDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(seatTypeService.createSeatType(reqSeatTypeDTO));
    }

    @PutMapping("/{id}")
    @APIMessage("Update a seat type")
    public ResponseEntity<SeatType> updateSeatType(@PathVariable("id") @SeatTypeIdExists Long id, @Validated(OnUpdate.class) @RequestBody ReqSeatTypeDTO reqSeatTypeDTO) {
        if(seatTypeService.existsBySeatTypeNameAndIdNot(reqSeatTypeDTO.getSeatTypeName(),id)) {
            throw new IdInvalidException("Seat type name already existed!");
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(seatTypeService.updateSeatType(id, reqSeatTypeDTO));
    }

    @DeleteMapping("/{id}")
    @APIMessage("Delete a seat type")
    public ResponseEntity<Void> deleteSeatType(@PathVariable("id") @SeatTypeIdExists Long id) {
        seatTypeService.deleteSeatType(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

}
