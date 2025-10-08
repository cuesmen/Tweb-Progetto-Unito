package com.filmssql.domain.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "releases")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Release {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false) @JoinColumn(name = "id_movie")
    private Movie movie;

    @ManyToOne(optional = false) @JoinColumn(name = "id_country")
    private Country country;

    private LocalDate date;

    private String type;

    private Double rating;
}
