package com.filmssql.domain.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.*;

@Entity
@Table(name = "movies")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Movie {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private LocalDate date;

    private String tagline;

    @Column(columnDefinition = "text")
    private String description;

    private Integer minute;

    private Double rating;

    // relationships

    @OneToMany(mappedBy = "movie", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Poster> posters = new HashSet<>();

    @OneToMany(mappedBy = "movie", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Theme> themes = new HashSet<>();

    @ManyToMany
    @JoinTable(
            name = "genres_movies",
            joinColumns = @JoinColumn(name = "id_movie"),
            inverseJoinColumns = @JoinColumn(name = "id_genre")
    )
    private Set<Genre> genres = new HashSet<>();

    @ManyToMany
    @JoinTable(
            name = "studios_movies",
            joinColumns = @JoinColumn(name = "id_movie"),
            inverseJoinColumns = @JoinColumn(name = "id_studio")
    )
    private Set<Studio> studios = new HashSet<>();

    @ManyToMany
    @JoinTable(
            name = "countries_movies",
            joinColumns = @JoinColumn(name = "id_movie"),
            inverseJoinColumns = @JoinColumn(name = "id_country")
    )
    private Set<Country> countries = new HashSet<>();

    @ManyToMany
    @JoinTable(
            name = "languages_movies",
            joinColumns = @JoinColumn(name = "id_movie"),
            inverseJoinColumns = @JoinColumn(name = "id_language")
    )
    private Set<Language> languages = new HashSet<>();
}
