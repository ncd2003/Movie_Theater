package com.group3.be.movie.theater.domain.show_dates;

import com.group3.be.movie.theater.domain.cinema_room.CinemaRoom;
import com.group3.be.movie.theater.domain.cinema_room.CinemaRoomRepository;
import com.group3.be.movie.theater.domain.movie.Movie;
import com.group3.be.movie.theater.domain.movie.MovieRepository;
import com.group3.be.movie.theater.domain.movie.MovieService;
import com.group3.be.movie.theater.domain.schedule.ScheduleService;
import com.group3.be.movie.theater.domain.show_dates.showdate_dto.ResShowDateDTO;
import com.group3.be.movie.theater.util.BaseService;
import com.group3.be.movie.theater.util.error.IdInvalidException;
import com.group3.be.movie.theater.util.error.RoomInUseException;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import javax.swing.text.html.Option;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class ShowDateService {
    private final ShowDateRepository showDateRepository;
    private final MovieService movieService;
    private final MovieRepository movieRepository;
    private final CinemaRoomRepository cinemaRoomRepository;
    private final BaseService baseService;

    // Define the correct date format (dd/MM/yyyy)
    private static final DateTimeFormatter DATE_FORMAT = DateTimeFormatter.ofPattern("dd/MM/yyyy");
    private final ScheduleService scheduleService;

    public ResShowDateDTO addShowDate(Long movieId, LocalDate date) {
        // Find the movie by ID
        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() -> new IllegalArgumentException("Movie not found with ID: " + movieId));

        // Create new ShowDate and associate it with the Movie
        ShowDate showDate = new ShowDate();
        showDate.setShowDate(date);
        showDate.setMovie(movie);

        // Save and return as DTO
        return convertToShowDateDTO(showDateRepository.save(showDate));
    }

    @Transactional(rollbackOn = Exception.class)
    public List<ResShowDateDTO> addShowDatesByRange(Long movieId, LocalDate startDate, LocalDate endDate, Long roomId, List<LocalTime> scheduleTimes) {
        // Find the movie with movie ID
        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() -> new IllegalArgumentException("Movie not found with ID: " + movieId));

        // Find the cinema room by ID
        Optional<CinemaRoom> cinemaRoomOpt = cinemaRoomRepository.findByCinemaRoomIdAndActiveTrue(roomId);
        if (cinemaRoomOpt.isEmpty()) {
            throw new IllegalArgumentException("Cinema room not found with ID: " + roomId);
        }
        CinemaRoom cinemaRoom = cinemaRoomOpt.get();

        // Get all existing show dates within the range
        List<ShowDate> showDatesInRange = showDateRepository.findByShowDateBetweenAndMovie_MovieId(startDate, endDate,  movieId);
        boolean hasConflict = showDatesInRange.stream()
                .anyMatch(showDate -> showDate.getCinemaRoom() != null);

        if (hasConflict) {
            throw new RoomInUseException("Some show dates in the specified range already have a room assigned.");
        }
        showDateRepository.saveAll(showDatesInRange); // Save changes

        List<ShowDate> showDateList = new ArrayList<>();
        LocalDate currentDate = startDate;

        while (!currentDate.isAfter(endDate)) {
            // Find existing show date that matches movie and date
            Optional<ShowDate> existingShowDate = showDateRepository.findByMovie_MovieIdAndShowDate(movieId, currentDate);
            ShowDate showDate;

            // If show date exists, update cinema room
            if (existingShowDate.isPresent()) {
                showDate = existingShowDate.get();
                showDate.setCinemaRoom(cinemaRoom);
            } else {
                // Otherwise, create new show date with cinema room
                showDate = new ShowDate();
                showDate.setShowDate(currentDate);
                showDate.setMovie(movie);
                showDate.setCinemaRoom(cinemaRoom);
            }
            showDateList.add(showDateRepository.save(showDate));
            currentDate = currentDate.plusDays(1);
        }

        // Convert to DTO and return
        return showDateList.stream().map(this::convertToShowDateDTO).collect(Collectors.toList());
    }


    // Add a cinema room to an existing show date
    public ResShowDateDTO addRoomToShowDate(Long showDateId, Long roomId) {
        // Find the show date by ID
        ShowDate showDate = showDateRepository.findById(showDateId)
                .orElseThrow(() -> new IllegalArgumentException("ShowDate not found with ID: " + showDateId));

        // Find the cinema room by ID
        CinemaRoom cinemaRoom = cinemaRoomRepository.findByCinemaRoomIdAndActiveTrue(roomId)
                .orElseThrow(() -> new IllegalArgumentException("Cinema room not found with ID: " + roomId));

        LocalDate date = showDate.getShowDate();
        if (isShowDateWithRoomNotExists(date, roomId, showDateId)) {
            showDate.setCinemaRoom(cinemaRoom);
            return convertToShowDateDTO(showDateRepository.save(showDate));
        } else {
            throw new RoomInUseException("Room is already in use");
        }

    }


    public List<ResShowDateDTO> getShowDatesByMovie(Long movieId) {
        List<ShowDate> showDates = showDateRepository.findByMovie_MovieId(movieId);
        return showDates.stream().map(this::convertToShowDateDTO).collect(Collectors.toList());
    }

    public Optional<ShowDate> getShowDateByMovieIdAndDate(Long movieId, LocalDate date) {
        return showDateRepository.findByMovie_MovieIdAndShowDate(movieId, date);
    }


    private ResShowDateDTO convertToShowDateDTO(ShowDate showDate) {
        ResShowDateDTO dto = baseService.convertObjectToObject(showDate, ResShowDateDTO.class);
        dto.setCinemaRoomId(showDate.getCinemaRoom() != null ? showDate.getCinemaRoom().getCinemaRoomId() : null);
        return dto;
    }

    private boolean isShowDateWithRoomNotExists(LocalDate date, Long cinemaRoomId, Long showDateId) {
        return showDateRepository
                .findByShowDateAndCinemaRoom_CinemaRoomIdAndShowDateIdNot(date, cinemaRoomId, showDateId)
                .isEmpty(); // returns true if not found (empty), false if present
    }

    @Transactional(rollbackOn = Exception.class)
    public String addShowDatesAndSchedules(Long movieId, LocalDate startDate, LocalDate endDate, Long roomId, List<LocalTime> scheduleTimes) {
        addShowDatesByRange(movieId, startDate, endDate, roomId, scheduleTimes);
        scheduleService.addSchedulesByRange(scheduleTimes, startDate, endDate, movieId);
        return "Schedules added from "+startDate+" to "+endDate;
    }

}
