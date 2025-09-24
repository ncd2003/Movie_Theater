package com.group3.be.movie.theater.domain.seat;

import com.group3.be.movie.theater.domain.cinema_room.CinemaRoom;
import com.group3.be.movie.theater.domain.cinema_room.CinemaRoomRepository;
import com.group3.be.movie.theater.domain.cinema_room.CinemaRoomService;
import com.group3.be.movie.theater.domain.cinema_room.dto.ResCinemaRoomDTO;
import com.group3.be.movie.theater.domain.seat.dto.ReqSeatDTO;
import com.group3.be.movie.theater.domain.seat.dto.ResSeatDTO;
import com.group3.be.movie.theater.domain.seat_status.SeatStatus;
import com.group3.be.movie.theater.domain.seat_status.SeatStatusRepository;
import com.group3.be.movie.theater.domain.seat_type.SeatType;
import com.group3.be.movie.theater.domain.seat_type.SeatTypeRepository;
import com.group3.be.movie.theater.domain.seat_type.SeatTypeService;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class SeatService {
    private final SeatRepository seatRepository;
    private final SeatTypeRepository seatTypeRepository;
    private final CinemaRoomRepository cinemaRoomRepository;
    private final CinemaRoomService cinemaRoomService;
    private final SeatStatusRepository seatStatusRepository;

    public ResSeatDTO handleGetAllSeats(CinemaRoom roomDB) {
        ResSeatDTO resSeatDTO = new ResSeatDTO();
        ResCinemaRoomDTO resCinemaRoomDTO = new ResCinemaRoomDTO();
        resCinemaRoomDTO.setCinemaRoomId(roomDB.getCinemaRoomId());
        resCinemaRoomDTO.setCinemaRoomName(roomDB.getCinemaRoomName());
        resCinemaRoomDTO.setRoomSizeRow(roomDB.getRoomSizeRow());
        resCinemaRoomDTO.setRoomSizeCol(roomDB.getRoomSizeCol());
        resCinemaRoomDTO.setSeatQuantity(roomDB.getSeatQuantity());

        resSeatDTO.setResCinemaRoomDTO(resCinemaRoomDTO);
        List<List<ResSeatDTO.SeatDTO>> matrixSeat = new java.util.ArrayList<>();
        for (int i = 0; i < roomDB.getRoomSizeRow(); i++) {
            List<ResSeatDTO.SeatDTO> seatDTOS = fetchAllSeatsByRoomIdAndSeatRow(roomDB.getCinemaRoomId(), i).stream().map(SeatMapper::covertToSeatDTO).toList();
            matrixSeat.add(seatDTOS);
        }
        resSeatDTO.setSeatMatrix(matrixSeat);
        return resSeatDTO;
    }

    @Transactional
    public void handleCreateSetupSeats(Long roomId, ReqSeatDTO reqSeatDTO) {
        List<List<ReqSeatDTO.SeatDTO>> seatMatrix = reqSeatDTO.getSeatMatrix();
        for (List<ReqSeatDTO.SeatDTO> row : seatMatrix) {
            for (ReqSeatDTO.SeatDTO seatDTO : row) {
                Seat seat = new Seat();
                seat.setSeatRow(seatDTO.getRow());
                seat.setSeatColumn(seatDTO.getCol());

                // Seat type
                Optional<SeatType> seatTypeDB = seatTypeRepository.findById(seatDTO.getSeatTypeId());
                seatTypeDB.ifPresent(seat::setSeatType);

                // Seat status
                Optional<SeatStatus> seatStatusDB = seatStatusRepository.findById(seatDTO.getSeatStatusId());
                seatStatusDB.ifPresent(seat::setSeatStatus);

                // Cinema room
                CinemaRoom cinemaRoom = cinemaRoomRepository.findById(roomId).get();
                seat.setCinemaRoom(cinemaRoom);
                seatRepository.save(seat);
            }
        }
    }

    @Transactional
    public void handleUpdateSetupSeats(Long roomId, ResSeatDTO resSeatDTO) {
        List<List<ResSeatDTO.SeatDTO>> seatMatrix = resSeatDTO.getSeatMatrix();
        for (List<ResSeatDTO.SeatDTO> row : seatMatrix) {
            for (ResSeatDTO.SeatDTO seatDTO : row) {
                SeatType seatTypeDB = seatTypeRepository.findById(seatDTO.getResSeatTypeDTO().getSeatTypeId()).get();
                SeatStatus seatStatusDB = seatStatusRepository.findById(seatDTO.getResSeatStatusDTO().getSeatStatusId()).get();
                seatRepository.updateSeatTypeByRoom(roomId, seatDTO.getRow(), seatDTO.getCol(), seatTypeDB, seatStatusDB);
            }
        }
    }

    public boolean isExistRoomInSeat(Long roomId) {
        return seatRepository.existsByCinemaRoom_CinemaRoomId(roomId);
    }

    public List<Seat> fetchAllSeatsByRoomIdAndSeatRow(Long roomId, int seatRow) {
        return seatRepository.findSeatsByRoomIdAndSeatRow(roomId, seatRow);
    }

    public int maxRow(Long roomId) {
        return cinemaRoomService.fetchRoomById(roomId).get().getRoomSizeRow();
    }

    public int maxCol(Long roomId) {
        return cinemaRoomService.fetchRoomById(roomId).get().getRoomSizeCol();
    }

    public Seat fetchSeatByRowColAndRoomId(Long roomId, int row, int col) {
        CinemaRoom cinemaRoom = cinemaRoomRepository.findById(roomId).get();
        return seatRepository.findByCinemaRoomAndSeatRowAndSeatColumn(cinemaRoom, row, col);
    }
}
