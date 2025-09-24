package com.group3.be.movie.theater.domain.movie;

import com.group3.be.movie.theater.domain.movie.dto.ReqMovieDTO;
import com.group3.be.movie.theater.domain.movie.dto.ResMovieAdminDTO;
import com.group3.be.movie.theater.domain.movie.dto.ResMovieDTO;
import com.group3.be.movie.theater.domain.show_dates.ShowDate;
import com.group3.be.movie.theater.domain.show_dates.ShowDateRepository;
import com.group3.be.movie.theater.domain.type.Type;
import com.group3.be.movie.theater.domain.type.TypeRepository;
import com.group3.be.movie.theater.util.BaseService;
import com.group3.be.movie.theater.util.error.IdInvalidException;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class MovieService {
    private final MovieRepository movieRepository;
    private final TypeRepository typeRepository;
    private final ShowDateRepository showDateRepository;
    private final BaseService baseService;

    public ResMovieDTO createMovie(ReqMovieDTO reqMovieDTO) {
        Movie movie = baseService.convertObjectToObject(reqMovieDTO, Movie.class);
        if (movie.getTypes() == null) {
            movie.setTypes(List.of());
        }
        movie.setActive(true);
        Movie savedMovie = movieRepository.save(movie);
        return baseService.convertObjectToObject(savedMovie, ResMovieDTO.class);
    }



    // search movie for name
    public List<ResMovieDTO> searchMovies(String keyword) {
        List<Movie> allMovies = movieRepository.findAll().stream()
                .filter(movie -> Boolean.TRUE.equals(movie.getActive()))
                .collect(Collectors.toList());

        List<Movie> filterMovies = allMovies.stream()
                .filter(p -> p.getMovieName() != null && p.getMovieName().toLowerCase().contains(keyword.toLowerCase()))
                .toList();

        return MovieMapper.movieDTOList(filterMovies);
    }

    public Boolean isExistMovie(Movie movie) {
        return movieRepository.existsByMovieName(movie.getMovieName());
    }

    public List<ResMovieDTO> getAllMovie() {
        return movieRepository.findAll().stream()
                .filter(movie -> Boolean.TRUE.equals(movie.getActive()))
                .map(movie -> baseService.convertObjectToObject(movie, ResMovieDTO.class))
                .collect(Collectors.toList());
    }

    public ResMovieDTO getMovieById(Long id) {
        return movieRepository.findById(id)
                .filter(movie -> Boolean.TRUE.equals(movie.getActive()))
                .map(movie -> baseService.convertObjectToObject(movie, ResMovieDTO.class))
                .orElse(null);
    }


    public ResMovieDTO updateMovie(Long id, ReqMovieDTO movieDTO) {
        return movieRepository.findById(id).map(movie -> {
            movie.setActor(movieDTO.getActor());
            movie.setContent(movieDTO.getContent());
            movie.setDirector(movieDTO.getDirector());
            movie.setDuration(movieDTO.getDuration());
            movie.setFromDate(movieDTO.getFromDate());
            movie.setToDate(movieDTO.getToDate());
            movie.setMovieProductionCompany(movieDTO.getMovieProductionCompany());
            movie.setVersion(movieDTO.getVersion());
            movie.setMovieName(movieDTO.getMovieName());
            movie.setTrailer(movieDTO.getTrailer());
            Movie savedMovie = movieRepository.save(movie);
            return baseService.convertObjectToObject(savedMovie, ResMovieDTO.class);
        }).orElse(null);
    }


    public void deleteMovie(Long id) {
        Movie deletedMovie = movieRepository.findById(id).orElse(null);
        if (deletedMovie != null) {
            deletedMovie.setActive(false);
            movieRepository.save(deletedMovie);
        }
    }

    public ResMovieDTO addTypesToMovie(Long movieId, List<Long> typeIds) {
        Movie movie = movieRepository.findById(movieId)
                .filter(m -> Boolean.TRUE.equals(m.getActive()))
                .orElseThrow(() -> new IdInvalidException("Movie not found"));

        movie.setTypes(List.of());
        List<Type> types = typeRepository.findAllById(typeIds);
        movie.setTypes(types);
        Movie updatedMovie = movieRepository.save(movie);
        return baseService.convertObjectToObject(updatedMovie, ResMovieDTO.class);
    }

    // Get list movie by date
    public List<Movie> getMoviesByDate(LocalDate date) {
        List<ShowDate> showDates = showDateRepository.findByShowDate(date);

        return showDates.stream()
                .filter(showDate -> showDate.getSchedules() != null && !showDate.getSchedules().isEmpty())
                .map(ShowDate::getMovie)
                .filter(Objects::nonNull)
                .filter(movie -> Boolean.TRUE.equals(movie.getActive()))
                .distinct()
                .collect(Collectors.toList());
    }

    public ResMovieDTO addImageToMovie(Long movieId, String imageUrl) {
        Movie movie = movieRepository.findById(movieId)
                .filter(m -> Boolean.TRUE.equals(m.getActive()))
                .orElseThrow(() -> new IdInvalidException("Movie not found"));

        movie.setImage(imageUrl);
        Movie updatedMovie = movieRepository.save(movie);
        return baseService.convertObjectToObject(updatedMovie, ResMovieDTO.class);
    }

    public List<ResMovieAdminDTO> getAllMovieAdmin() {
        List<Movie> movies = movieRepository.findAll().stream()
                .filter(movie -> Boolean.TRUE.equals(movie.getActive()))
                .collect(Collectors.toList());

        return movies.stream()
                .map(movie -> baseService.convertObjectToObject(movie, ResMovieAdminDTO.class))
                .collect(Collectors.toList());
    }
}
