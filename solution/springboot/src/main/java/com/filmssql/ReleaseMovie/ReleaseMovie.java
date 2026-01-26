package com.filmssql.ReleaseMovie;

import com.filmssql.Country.Country;
import com.filmssql.Movie.Movie;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

/**
 * Release information for a movie, including country, date and type.
 */
@Entity
@Table(name = "releases_movies")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ReleaseMovie {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "movie_id", nullable = false)
    private Movie movie;

    @ManyToOne(fetch = FetchType.LAZY, optional = true)
    @JoinColumn(name = "country_id")
    private Country country;

    @Column(name = "release_date", nullable = false)
    private LocalDate releaseDate;

    @Column(name = "release_type", nullable = false)
    private String releaseType;

    @Column(name = "rating")
    private String rating;
}
