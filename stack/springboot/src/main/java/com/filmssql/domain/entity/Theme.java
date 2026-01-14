package com.filmssql.domain.entity;

import jakarta.persistence.*;
import lombok.*;

/**
 * Thematic tag associated with a movie.
 */
@Entity
@Table(name = "themes")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Theme {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "movie_id")
    @com.fasterxml.jackson.annotation.JsonIgnore
    private Movie movie;

    @Column(nullable = false)
    private String theme;
}
