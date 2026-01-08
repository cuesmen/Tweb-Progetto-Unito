package com.filmssql.domain.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "oscar_awards")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OscarAward {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "year_film")
    private String yearFilm;

    @Column(name = "year_ceremony")
    private String yearCeremony;

    @Column
    private String category;

    @Column
    private String name;

    @Column
    private String film;

    @Column
    private Boolean winner;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "actor_id")
    private Actor actor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "movie_id")
    private Movie movie;
}
