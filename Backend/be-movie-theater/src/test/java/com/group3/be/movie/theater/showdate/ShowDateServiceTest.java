package com.group3.be.movie.theater.showdate;

import com.group3.be.movie.theater.domain.cinema_room.CinemaRoom;
import com.group3.be.movie.theater.domain.cinema_room.CinemaRoomRepository;
import com.group3.be.movie.theater.domain.movie.Movie;
import com.group3.be.movie.theater.domain.movie.MovieRepository;
import com.group3.be.movie.theater.domain.show_dates.ShowDate;
import com.group3.be.movie.theater.domain.show_dates.ShowDateRepository;
import com.group3.be.movie.theater.domain.show_dates.ShowDateService;
import com.group3.be.movie.theater.domain.show_dates.showdate_dto.ResShowDateDTO;
import com.group3.be.movie.theater.util.BaseService;
import com.group3.be.movie.theater.util.error.RoomInUseException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import java.time.LocalDate;
import java.util.*;


import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class ShowDateServiceTest {
    @InjectMocks
    private ShowDateService showDateService;

    @Mock
    private ShowDateRepository showDateRepository;
    @Mock
    private MovieRepository movieRepository;
    @Mock
    private CinemaRoomRepository cinemaRoomRepository;
    @Mock
    private BaseService baseService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testAddShowDate_Success() {
        Long movieId = 1L;
        LocalDate date = LocalDate.now();
        Movie movie = new Movie();
        movie.setMovieId(movieId);

        when(movieRepository.findById(movieId)).thenReturn(Optional.of(movie));

        ShowDate savedShowDate = new ShowDate();
        savedShowDate.setShowDate(date);
        savedShowDate.setMovie(movie);

        when(showDateRepository.save(any(ShowDate.class))).thenReturn(savedShowDate);
        when(baseService.convertObjectToObject(any(), eq(ResShowDateDTO.class))).thenReturn(new ResShowDateDTO());

        var result = showDateService.addShowDate(movieId, date);
        assertNotNull(result);
    }

    @Test
    void testAddRoomToShowDate_RoomAlreadyInUse_ThrowsException() {
        Long showDateId = 1L;
        Long roomId = 2L;
        ShowDate showDate = new ShowDate();
        showDate.setShowDate(LocalDate.now());

        CinemaRoom room = new CinemaRoom();
        room.setCinemaRoomId(roomId);

        when(showDateRepository.findById(showDateId)).thenReturn(Optional.of(showDate));
        when(cinemaRoomRepository.findByCinemaRoomIdAndActiveTrue(roomId)).thenReturn(Optional.of(room));
        when(showDateRepository.findByShowDateAndCinemaRoom_CinemaRoomIdAndShowDateIdNot(any(), any(), any()))
                .thenReturn(Optional.of(new ShowDate())); // already in use

        assertThrows(RoomInUseException.class, () -> showDateService.addRoomToShowDate(showDateId, roomId));
    }

    @Test
    void testGetShowDatesByMovie() {
        Long movieId = 1L;
        List<ShowDate> showDates = List.of(new ShowDate(), new ShowDate());
        when(showDateRepository.findByMovie_MovieId(movieId)).thenReturn(showDates);
        when(baseService.convertObjectToObject(any(), eq(ResShowDateDTO.class)))
                .thenReturn(new ResShowDateDTO());

        var result = showDateService.getShowDatesByMovie(movieId);
        assertEquals(2, result.size());
    }

}
