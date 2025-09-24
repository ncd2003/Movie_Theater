    package com.group3.be.movie.theater.domain.show_dates;

    import com.fasterxml.jackson.annotation.JsonBackReference;
    import com.fasterxml.jackson.annotation.JsonIgnore;
    import com.group3.be.movie.theater.domain.cinema_room.CinemaRoom;
    import com.group3.be.movie.theater.domain.movie.Movie;
    import com.group3.be.movie.theater.domain.schedule.Schedule;
    import jakarta.persistence.*;
    import lombok.Data;

    import java.time.LocalDate;
    import java.util.List;

    @Data
    @Entity
    @Table(name = "MOVIETHEATER.SHOW_DATES")
    public class ShowDate
    {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        @Column(name = "SHOW_DATE_ID")
        private Long showDateId;

        @Column(name = "SHOW_DATE")
        private LocalDate showDate;

        @JsonBackReference  // Đánh dấu đây là quan hệ bị quản lý để tránh vòng lặp
        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "MOVIE_ID")
        @JsonIgnore
        private Movie movie;

        @JsonIgnore
        @OneToMany(mappedBy = "showDate", cascade = CascadeType.ALL, orphanRemoval = true)
        private List<Schedule> schedules;

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "CINEMA_ROOM_ID")  // Foreign key to CinemaRoom
        @JsonIgnore
        private CinemaRoom cinemaRoom;

        
    }
