package com.filmssql.domain.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "posters")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Poster {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "id_movie")
    private Movie movie;

    @Column(nullable = false)
    private String link;
}
