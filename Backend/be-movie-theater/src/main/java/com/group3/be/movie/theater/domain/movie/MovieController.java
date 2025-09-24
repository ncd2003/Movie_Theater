package com.group3.be.movie.theater.domain.movie;


import com.group3.be.movie.theater.domain.cinema_room.CinemaRoom;
import com.group3.be.movie.theater.domain.cinema_room.CinemaRoomService;
import com.group3.be.movie.theater.domain.movie.dto.ReqMovieDTO;
import com.group3.be.movie.theater.domain.movie.dto.ResMovieAdminDTO;
import com.group3.be.movie.theater.domain.movie.dto.ResMovieDTO;
import com.group3.be.movie.theater.domain.movie.dto.ResMovieShowDate;
import com.group3.be.movie.theater.domain.movie.dto.ResMovieShowDate.MovieSchedule;
import com.group3.be.movie.theater.domain.schedule.Schedule;
import com.group3.be.movie.theater.domain.schedule.ScheduleService;
import com.group3.be.movie.theater.domain.show_dates.ShowDate;
import com.group3.be.movie.theater.domain.show_dates.ShowDateService;
import com.group3.be.movie.theater.util.annotation.APIMessage;
import com.group3.be.movie.theater.util.error.IdInvalidException;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@AllArgsConstructor
@RestController
@RequestMapping("/api/v1/movies")
public class MovieController {


    private final MovieService movieService;
    private final ScheduleService scheduleService;
    private final CinemaRoomService cinemaRoomService;
    private final ShowDateService showDateService;

    @APIMessage("Create a movie")
    @PostMapping
    public ResponseEntity<ResMovieDTO> createMovie(@RequestBody ReqMovieDTO movieDto) {
        ResMovieDTO savedMovie = movieService.createMovie(movieDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedMovie);
    }

    @APIMessage("Add types to a movie")
    @PostMapping("/{id}/types")
    public ResponseEntity<ResMovieDTO> addTypesToMovie(@PathVariable Long id, @RequestBody List<Long> typeIds) {
        ResMovieDTO updatedMovie = movieService.addTypesToMovie(id, typeIds);
        return ResponseEntity.ok(updatedMovie);
    }

    @APIMessage("Search movies by name")
    @GetMapping("/search")
    public ResponseEntity<ResMovieDTO> searchMovieByName(@RequestParam String keyword) {
//        Optional<MovieDTO> movie = movieService.searchMovies(keyword).stream().findFirst();
//        return movie.map(value -> new ResponseEntity<>(value, HttpStatus.OK)).orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
        List<ResMovieDTO> movies = movieService.searchMovies(keyword);
        if (movies.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        return ResponseEntity.status(HttpStatus.OK).body(movies.get(0));
    }


    @APIMessage("Get movie by id")
    @GetMapping("/client/{id}")
    public ResponseEntity<ResMovieDTO> getMovieById(@PathVariable Long id) {
        ResMovieDTO movie = movieService.getMovieById(id);
        return movie != null ? ResponseEntity.ok(movie) : ResponseEntity.notFound().build();
    }


    @APIMessage("Update movie")
    @PutMapping("/{id}")
    public ResponseEntity<ResMovieDTO> updateMovie(@PathVariable Long id, @RequestBody ReqMovieDTO reqMovieDTO) {
        ResMovieDTO updatedMovie = movieService.updateMovie(id, reqMovieDTO);
        return updatedMovie != null ? ResponseEntity.ok(updatedMovie) : ResponseEntity.notFound().build();
    }

    @APIMessage("Delete a movie")
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteMovie(@PathVariable Long id) {
        movieService.deleteMovie(id);
        return ResponseEntity.ok("Movie marked as inactive successfully.");
    }

    @APIMessage("Fetch all movies")
    @GetMapping("/client")
    public ResponseEntity<List<ResMovieDTO>> getAllMovies() {
        List<ResMovieDTO> movies = movieService.getAllMovie();
        return ResponseEntity.ok(movies);
    }

    @APIMessage("Get movies by date")
    @GetMapping("/client/by-date")
    public ResponseEntity<List<ResMovieShowDate>> getMoviesByDate(@RequestParam LocalDate date) {
        List<ResMovieShowDate> listMovieShowDate = new ArrayList<>();
        List<Movie> movies = movieService.getMoviesByDate(date);
        for (Movie movie : movies) {
            ResMovieShowDate resMovieShowDate = new ResMovieShowDate();

            // movie
            resMovieShowDate.setMovieId(movie.getMovieId());
            resMovieShowDate.setMovieName(movie.getMovieName());
            resMovieShowDate.setImage(movie.getImage());

            // room
            CinemaRoom cinemaRoom = showDateService.getShowDateByMovieIdAndDate(movie.getMovieId(), date).get().getCinemaRoom();
            resMovieShowDate.setRoomId(cinemaRoom.getCinemaRoomId());
            resMovieShowDate.setRoomName(cinemaRoom.getCinemaRoomName());

            // schedule
            List<Schedule> schedules = scheduleService.getSchedulesByDateAndMovie(movie.getMovieId(), date);
            List<MovieSchedule> listMovieSchedule = new ArrayList<>();
            for (Schedule schedule : schedules) {
                MovieSchedule movieSchedule = new MovieSchedule();
                movieSchedule.setScheduleId(schedule.getScheduleId());
                movieSchedule.setScheduleTime(schedule.getScheduleTime());
                listMovieSchedule.add(movieSchedule);
            }
            resMovieShowDate.setMovieSchedules(listMovieSchedule);
            listMovieShowDate.add(resMovieShowDate);
        }
        return ResponseEntity.status(HttpStatus.OK).body(listMovieShowDate);
    }

    @PostMapping("/{id}/image")
    public ResponseEntity<ResMovieDTO> addImageToMovie(@PathVariable Long id, @RequestBody Map<String, String> requestBody) {
        String imageUrl = requestBody.get("imageUrl");
        ResMovieDTO updatedMovie = movieService.addImageToMovie(id, imageUrl);
        return ResponseEntity.ok(updatedMovie);
    }

    @APIMessage("Fetch all movies (admin)")
    @GetMapping
    public ResponseEntity<List<ResMovieAdminDTO>> getAllMoviesAdmin() {
        List<ResMovieAdminDTO> movies = movieService.getAllMovieAdmin();
        return ResponseEntity.ok(movies);
    }



}












