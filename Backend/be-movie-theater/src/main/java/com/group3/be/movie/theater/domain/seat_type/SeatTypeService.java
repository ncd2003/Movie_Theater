package com.group3.be.movie.theater.domain.seat_type;

import com.group3.be.movie.theater.domain.seat_type.dto.ReqSeatTypeDTO;
import com.group3.be.movie.theater.domain.seat_type.dto.ResSeatTypeDTO;
import com.group3.be.movie.theater.util.BaseService;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class SeatTypeService {

    private final SeatTypeRepository seatTypeRepository;
    private final BaseService baseService;

    public List<SeatType> listAllSeatType() {
        return seatTypeRepository.findByActiveTrue();
    }

    public List<ResSeatTypeDTO> listAllSeatTypeDTO() {
        return seatTypeRepository.findByActiveTrue().stream().map((st) -> baseService.convertObjectToObject(st, ResSeatTypeDTO.class)).toList();
    }

    @Transactional
    public void createDefaultSeatType() {
        SeatType corridor = new SeatType();
        corridor.setSeatTypeName("Corridor");
        corridor.setSeatTypeColour("#ffffff");
        corridor.setSeatTypePrice(0.0);
        seatTypeRepository.saveAndFlush(corridor);
    }

    @Transactional
    public SeatType createSeatType(ReqSeatTypeDTO reqSeatTypeDTO) {
        return seatTypeRepository.save(baseService.convertObjectToObject(reqSeatTypeDTO, SeatType.class));
    }

    @Transactional
    public SeatType updateSeatType(Long id, ReqSeatTypeDTO reqSeatTypeDTO) {
        Optional<SeatType> seatType = seatTypeRepository.findById(id);
        if (seatType.isPresent()) {
            seatType.get().setSeatTypeName(reqSeatTypeDTO.getSeatTypeName());
            seatType.get().setSeatTypePrice(reqSeatTypeDTO.getSeatTypePrice());
            seatType.get().setSeatTypeColour(reqSeatTypeDTO.getSeatTypeColour());
            return seatTypeRepository.save(seatType.get());
        }
        return null;
    }

    @Transactional
    public void deleteSeatType(Long id) {
        Optional<SeatType> seatType = seatTypeRepository.findById(id);
        if (seatType.isPresent()) {
            seatType.get().setActive(false);
            seatTypeRepository.save(seatType.get());
        }
    }

    public boolean existsBySeatTypeName(String seatTypeName) {
        return seatTypeRepository.existsBySeatTypeNameAndActiveTrue(seatTypeName);
    }

    public boolean existsBySeatTypeNameAndIdNot(String seatTypeName, Long id) {
        return seatTypeRepository.existsBySeatTypeIdNotAndSeatTypeNameAndActiveTrue(id, seatTypeName);
    }

    public boolean existsById(Long id) {
        return seatTypeRepository.existsById(id);
    }
}
