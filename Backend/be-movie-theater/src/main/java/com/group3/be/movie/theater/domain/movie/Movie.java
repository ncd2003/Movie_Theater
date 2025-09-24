package com.group3.be.movie.theater.domain.movie;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import com.group3.be.movie.theater.domain.schedule.Schedule;
import com.group3.be.movie.theater.domain.show_dates.ShowDate;
import com.group3.be.movie.theater.domain.type.Type;
import com.group3.be.movie.theater.util.SecurityUtil;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.time.Instant;
import java.util.Date;
import java.util.List;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Data
@Entity
@Table(name = "MOVIETHEATER.MOVIE")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Movie {
    @Id
    @Column(name = "MOVIE_ID")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long movieId;

    @Column(name = "ACTOR")
    private String actor;

    @Column(name = "CONTENT", columnDefinition = "MEDIUMTEXT")
    private String content;

    @Column(name = "DIRECTOR")
    private String director;

    @Column(name = "DURATION")
    private Integer duration;

    @Column(name = "FROM_DATE")
    private Date fromDate;

    @Column(name = "TO_DATE")
    private Date toDate;

    @Column(name = "MOVIE_PRODUCTION_COMPANY")
    private String movieProductionCompany;

    @Column(name = "VERSION")
    private String version;

    @Column(name = "TRAILER")
    private String trailer;

    @NotBlank(message = "Movie cannot be empty")
    @Column(name = "MOVIE_NAME",unique = true, nullable = false)
    private String movieName;

    @Column(name = "IMAGE")
    private String image;

    @Column(name = "ACTIVE")
    private Boolean active;
    @Column(name = "CREATE_AT")
    private Instant createdAt;
    @Column(name = "UPDATE_AT")
    private Instant updatedAt;
    @Column(name = "CREATE_BY")
    private String createdBy;
    @Column(name = "UPDATE_BY")
    private String updatedBy;

    @JsonIgnore
    @OneToMany(mappedBy = "movie", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<ShowDate> showDates;

    @JsonIgnore
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "MOVIE_TYPE",
            joinColumns = @JoinColumn(name = "MOVIE_ID"),
            inverseJoinColumns = @JoinColumn(name = "TYPE_ID"))
    private List<Type> types;

    @PrePersist
    public void handleBeforeCreateAt(){
        this.createdBy = SecurityUtil.getCurrentUserLogin().isPresent() ? SecurityUtil.getCurrentUserLogin().get() : null;
        this.createdAt = Instant.now();
    }

    @PreUpdate
    public void handleBeforeUpdateAt(){
        this.updatedBy = SecurityUtil.getCurrentUserLogin().isPresent() ? SecurityUtil.getCurrentUserLogin().get() : null;
        this.updatedAt = Instant.now();
    }

}
