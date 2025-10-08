package com.filmssql.domain.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "releases_movies")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Release_Movies
{
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false) @JoinColumn(name = "movie_id")
    private Movie movie;

    @ManyToOne(optional = false) @JoinColumn(name = "country_id")
    private Country country;

    private LocalDate date;

    private String type;

    private Double rating;
}
