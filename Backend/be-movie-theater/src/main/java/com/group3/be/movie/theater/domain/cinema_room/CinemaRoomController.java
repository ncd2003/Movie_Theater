package com.group3.be.movie.theater.domain.cinema_room;

import com.group3.be.movie.theater.domain.cinema_room.dto.ReqCinemaRoomDTO;
import com.group3.be.movie.theater.domain.cinema_room.dto.ResCinemaRoomDTO;
import com.group3.be.movie.theater.util.annotation.APIMessage;
import com.group3.be.movie.theater.util.error.IdInvalidException;
import com.group3.be.movie.theater.util.validation.groups.OnCreate;
import com.group3.be.movie.theater.util.validation.room.CinemaRoomIdExists;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/v1/cinema-room")
@AllArgsConstructor
public class CinemaRoomController {

    private final CinemaRoomService cinemaRoomService;

    @APIMessage("Fetch all rooms")
    @GetMapping
    public ResponseEntity<List<CinemaRoom>> getAllRooms() {
        return ResponseEntity.ok().body(cinemaRoomService.fetchAllCinemaRooms());
    }

    @APIMessage("Create a room")
    @PostMapping
    public ResponseEntity<CinemaRoom> createARoom(@Validated(OnCreate.class) @RequestBody ReqCinemaRoomDTO reqCinemaRoomDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(cinemaRoomService.handleCreateRoom(reqCinemaRoomDTO));
    }

    @APIMessage("Update a room")
    @PutMapping("/{id}")
    public ResponseEntity<CinemaRoom> updateARoom(@PathVariable("id") @CinemaRoomIdExists Long id, @Validated @RequestBody ReqCinemaRoomDTO reqCinemaRoomDTO) {
        if(cinemaRoomService.isExistsByCinemaRoomNameAndIdNot(reqCinemaRoomDTO.getCinemaRoomName(), id)) {
            throw new IdInvalidException("Room name already existed");
        };
        return ResponseEntity.ok().body(cinemaRoomService.handleUpdateRoom(id, reqCinemaRoomDTO));
    }

    @APIMessage("Delete a room")
    @DeleteMapping("{id}")
    public ResponseEntity<Void> deleteARoom(@PathVariable("id") @CinemaRoomIdExists Long id) {

        cinemaRoomService.handleDeleteRoom(id);
        return ResponseEntity.noContent().build();
    }

    @APIMessage("Fetch a room by id")
    @GetMapping("/{id}")
    public ResponseEntity<ResCinemaRoomDTO> getACinemaRoomById(@PathVariable("id") @CinemaRoomIdExists Long id) {
        CinemaRoom roomDB = cinemaRoomService.fetchRoomById(id).get();
        return ResponseEntity.ok().body(CinemaRoomMapper.toResCinemaRoomDTO(roomDB));
    }
}
