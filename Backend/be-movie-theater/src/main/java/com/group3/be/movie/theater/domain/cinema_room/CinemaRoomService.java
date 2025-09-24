package com.group3.be.movie.theater.domain.cinema_room;

import com.group3.be.movie.theater.domain.cinema_room.dto.ReqCinemaRoomDTO;
import com.group3.be.movie.theater.util.BaseService;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class CinemaRoomService {
    private final CinemaRoomRepository cinemaRoomRepository;
    private final BaseService baseService;

    public List<CinemaRoom> fetchAllCinemaRooms() {
        return cinemaRoomRepository.findByActiveTrue();
    }
    @Transactional
    public CinemaRoom handleCreateRoom(ReqCinemaRoomDTO ReqCinemaRoomDTO) {
        return cinemaRoomRepository.save(baseService.convertObjectToObject(ReqCinemaRoomDTO, CinemaRoom.class));
    }

    @Transactional
    public CinemaRoom handleUpdateRoom(Long id , ReqCinemaRoomDTO reqCinemaRoomDTO) {
        CinemaRoom cinemaRoomDB = cinemaRoomRepository.findById(id).get();
        cinemaRoomDB.setCinemaRoomName(reqCinemaRoomDTO.getCinemaRoomName());
        cinemaRoomDB.setSeatQuantity(reqCinemaRoomDTO.getSeatQuantity());
        return cinemaRoomRepository.save(cinemaRoomDB);
    }

    @Transactional
    public void handleUpdateRowsAndCols(CinemaRoom cinemaRoom) {
        cinemaRoomRepository.save(cinemaRoom);
    }

    @Transactional
    public void handleDeleteRoom(Long id) {
        CinemaRoom cinemaRoomDB = cinemaRoomRepository.findById(id).get();
        cinemaRoomDB.setActive(false);
        cinemaRoomRepository.save(cinemaRoomDB);
    }

    public Optional<CinemaRoom> fetchRoomById(Long id) {
        return cinemaRoomRepository.findByCinemaRoomIdAndActiveTrue(id);
    }

    public boolean isExistsByCinemaRoomNameAndIdNot(String cinemaRoomName, Long id) {
        return cinemaRoomRepository.existsByCinemaRoomIdNotAndCinemaRoomNameAndActiveTrue(id, cinemaRoomName);
    }
    
    public boolean isExistRoomByName(String roomName) {
        return cinemaRoomRepository.existsByCinemaRoomNameAndActiveTrue(roomName);
    }
    public boolean isExistRoomById(Long roomId) {
        return cinemaRoomRepository.existsByCinemaRoomIdAndActiveTrue(roomId);
    }

}
