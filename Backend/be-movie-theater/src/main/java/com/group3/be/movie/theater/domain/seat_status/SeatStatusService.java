package com.group3.be.movie.theater.domain.seat_status;

import com.group3.be.movie.theater.domain.seat_status.dto.ReqSeatStatusDTO;
import com.group3.be.movie.theater.domain.seat_status.dto.ResSeatStatusDTO;
import com.group3.be.movie.theater.util.BaseService;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class SeatStatusService {
    private final SeatStatusRepository seatStatusRepository;
    private final BaseService baseService;

    public List<SeatStatus> getAllSeatStatus() {
        return seatStatusRepository.findByActiveTrue();
    }

    public List<ResSeatStatusDTO> getAllSeatStatusDTO(){
        return seatStatusRepository.findByActiveTrue().stream().map((st) -> baseService.convertObjectToObject(st, ResSeatStatusDTO.class)).toList();
    }

    @Transactional
    public void createDefaultSeatStatus() {
            // status default 1 : available
            SeatStatus available = new SeatStatus();
            available.setSeatStatusName("Available");
            available.setSeatStatusColour("#ffffff");
            // status default 2 : booked
            SeatStatus booked = new SeatStatus();
            booked.setSeatStatusName("Booked");
            booked.setSeatStatusColour("#b0b0b0");
            booked.setIsSelectable(false);
            // save
            seatStatusRepository.saveAllAndFlush(List.of(available, booked));
    }

    @Transactional
    public SeatStatus createSeatStatus(ReqSeatStatusDTO reqSeatStatusDTO) {
        return seatStatusRepository.save(baseService.convertObjectToObject(reqSeatStatusDTO, SeatStatus.class));
    }

    @Transactional
    public SeatStatus updateSeatStatus(Long id, ReqSeatStatusDTO reqSeatStatusDTO) {
        SeatStatus seatStatusDB = seatStatusRepository.findBySeatStatusId(id);
        seatStatusDB.setSeatStatusName(reqSeatStatusDTO.getSeatStatusName());
        seatStatusDB.setSeatStatusColour(reqSeatStatusDTO.getSeatStatusColour());
        seatStatusDB.setIsSelectable(reqSeatStatusDTO.getIsSelectable());
        return seatStatusRepository.save(seatStatusDB);
    }

    @Transactional
    public void deleteSeatStatus(Long id) {
        SeatStatus seatStatusDB = seatStatusRepository.findBySeatStatusId(id);
        seatStatusDB.setActive(false);
        seatStatusRepository.save(seatStatusDB);
    }


    public boolean existsBySeatStatusNameAndIdNot(String seatStatusName, Long id) {
        return seatStatusRepository.existsBySeatStatusIdNotAndSeatStatusNameAndActiveTrue(id, seatStatusName);
    }

    public boolean isExistSeatStatusByName(String name) {
        return seatStatusRepository.existsBySeatStatusNameAndActiveTrue(name);
    }

    public boolean isExistSeatStatusById(Long id) {
        return seatStatusRepository.existsById(id);
    }
}
