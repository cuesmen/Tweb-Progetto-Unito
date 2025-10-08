package com.filmssql.domain.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "actors_movies")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ActorMovie {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false) @JoinColumn(name = "movie_id")
    private Movie movie;

    @ManyToOne(optional = false) @JoinColumn(name = "actor_id")
    private Actor actor;

    private String role; // free-text role per the diagram
}
