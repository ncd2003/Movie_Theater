package com.group3.be.movie.theater.domain.seat;

import com.group3.be.movie.theater.domain.cinema_room.CinemaRoom;
import com.group3.be.movie.theater.domain.seat_status.SeatStatus;
import com.group3.be.movie.theater.domain.seat_type.SeatType;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface SeatRepository extends JpaRepository<Seat, Long> {
    boolean existsByCinemaRoom_CinemaRoomId(Long cinemaRoomId);
//    @Query("SELECT s FROM Seat s WHERE s.cinemaRoom.cinemaRoomId = :roomId " +
//            "AND s.seatRow = :seatRow " +
//            "AND s.seatType.seatTypeId <> 1")
//    List<Seat> findSeatsByRoomIdAndSeatRowAndSeatTypeNotOne(
//            @Param("roomId") Long roomId,
//            @Param("seatRow") Integer seatRow
//    );

    @Query("SELECT s FROM Seat s WHERE s.cinemaRoom.cinemaRoomId = :roomId " +
            "AND s.seatRow = :seatRow ")
    List<Seat> findSeatsByRoomIdAndSeatRow(
            @Param("roomId") Long roomId,
            @Param("seatRow") Integer seatRow
    );

        @Modifying
        @Transactional
        @Query("UPDATE Seat s SET s.seatType = :seatType , s.seatStatus = :seatStatus " +
                "WHERE s.cinemaRoom.cinemaRoomId = :roomId AND s.seatRow = :row AND s.seatColumn = :col")
        void updateSeatTypeByRoom(@Param("roomId") Long roomId,
                                  @Param("row") int row,
                                  @Param("col") int col,
                                  @Param("seatType") SeatType seatType,
                                  @Param("seatStatus") SeatStatus seatStatus);


    Seat findByCinemaRoomAndSeatRowAndSeatColumn(CinemaRoom cinemaRoom, int row, int col);
}
