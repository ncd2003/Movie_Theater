package com.group3.be.movie.theater.domain.type;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.group3.be.movie.theater.domain.movie.Movie;
import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Entity
@Table(name = "MOVIETHEATER.TYPE")
@Data
public class Type {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "TYPE_ID")
    private Long typeId;

    @Column(name = "TYPE_NAME", length = 255)
    private String typeName;

    @ManyToMany(fetch = FetchType.LAZY,mappedBy = "types")
    @JsonIgnore
    private List<Movie> movies;
}

