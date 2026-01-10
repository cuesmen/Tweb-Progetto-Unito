package com.filmssql.domain.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "actors_movies")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ActorMovie {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "movie_id", nullable = false)
    private Movie movie;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "actor_id", nullable = false)
    private Actor actor;

    private String role; 
}
