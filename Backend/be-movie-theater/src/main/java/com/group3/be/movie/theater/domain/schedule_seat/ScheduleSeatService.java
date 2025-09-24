package com.group3.be.movie.theater.domain.schedule_seat;

import com.group3.be.movie.theater.domain.cinema_room.CinemaRoom;
import com.group3.be.movie.theater.domain.cinema_room.dto.ResCinemaRoomDTO;
import com.group3.be.movie.theater.domain.schedule.Schedule;
import com.group3.be.movie.theater.domain.schedule_seat.dto.ReqScheduleSeatDTO;
import com.group3.be.movie.theater.domain.schedule_seat.dto.ResScheduleSeatDTO;
import com.group3.be.movie.theater.domain.seat.SeatService;
import com.group3.be.movie.theater.domain.seat.dto.ResSeatDTO;
import com.group3.be.movie.theater.domain.seat_status.SeatStatus;
import com.group3.be.movie.theater.domain.seat_status.SeatStatusRepository;
import com.group3.be.movie.theater.domain.seat_status.dto.ResSeatStatusDTO;
import com.group3.be.movie.theater.domain.seat_type.SeatType;
import com.group3.be.movie.theater.domain.seat_type.SeatTypeRepository;
import com.group3.be.movie.theater.util.BaseService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class ScheduleSeatService {
    private final BaseService baseService;
    private final SeatService seatService;
    private final ScheduleSeatRepository scheduleSeatRepository;
    private final SeatStatusRepository seatStatusRepository;

    public ResScheduleSeatDTO handleGetAllScheduleSeats(CinemaRoom roomDB, Long showDateId, Long scheduleId) {
        // Copy resSeatDTO
        ResScheduleSeatDTO resScheduleSeatsDTO = baseService.convertObjectToObject(seatService.handleGetAllSeats(roomDB), ResScheduleSeatDTO.class);
        List<List<ResSeatDTO.SeatDTO>> seatMatrix = resScheduleSeatsDTO.getSeatMatrix();

        // Lấy danh sách ScheduleSeat
        List<ScheduleSeat> listScheduleSeats = listScheduleSeats(roomDB.getCinemaRoomId(), scheduleId, showDateId);

        if (!listScheduleSeats.isEmpty()) {
            // Dùng Map để tra cứu nhanh
            Map<Long, Long> seatStatusMap = listScheduleSeats.stream()
                    .collect(Collectors.toMap(ScheduleSeat::getSeatId, ScheduleSeat::getSeatStatusId));

            // Duyệt ghế trong seatMatrix và cập nhật trạng thái ghế
            for (List<ResSeatDTO.SeatDTO> row : seatMatrix) {
                for (ResSeatDTO.SeatDTO seatDTO : row) {
                    Long statusId = seatStatusMap.get(seatDTO.getSeatId());
                    if (statusId != null) {
                        ResSeatStatusDTO resSeatStatusDTO = baseService.convertObjectToObject(
                                seatStatusRepository.findBySeatStatusId(statusId), ResSeatStatusDTO.class
                        );
                        seatDTO.setResSeatStatusDTO(resSeatStatusDTO);
                    }
                }
            }
        }

        return resScheduleSeatsDTO;
    }

    public void handleAddScheduleSeat(ReqScheduleSeatDTO reqScheduleSeatDTO) {
        for (ReqScheduleSeatDTO.SeatDTO seat : reqScheduleSeatDTO.getSeats()) {
            ScheduleSeat scheduleSeat = new ScheduleSeat(); // Tạo mới đối tượng trong mỗi vòng lặp
            scheduleSeat.setCinemaRoomId(reqScheduleSeatDTO.getCinemaRoomId());
            scheduleSeat.setScheduleId(reqScheduleSeatDTO.getScheduleId());
            scheduleSeat.setShowDateId(reqScheduleSeatDTO.getShowDateId());
            scheduleSeat.setSeatId(seat.getSeatId());
            scheduleSeat.setSeatStatusId(2L);
            scheduleSeatRepository.save(scheduleSeat);
        }
    }


    public List<ScheduleSeat> listScheduleSeats(Long roomId, Long scheduleId, Long showDateId) {
        return scheduleSeatRepository.findByCinemaRoomIdAndScheduleIdAndShowDateId(roomId, scheduleId, showDateId);
    }

    public boolean isExistCinemaRoom(Long roomId) {
        return scheduleSeatRepository.existsByCinemaRoomId(roomId);
    }


}
