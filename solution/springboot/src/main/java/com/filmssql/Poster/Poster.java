package com.filmssql.Poster;

import com.filmssql.Movie.Movie;
import jakarta.persistence.*;
import lombok.*;

/**
 * Poster asset linked one-to-one with a movie.
 */
@Entity
@Table(name = "posters")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Poster {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String link;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "movie_id", unique = true, nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private Movie movie;
}
