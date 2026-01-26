package com.filmssql.ActorMovie;

import com.filmssql.Actor.Actor;
import com.filmssql.Movie.Movie;
import jakarta.persistence.*;
import lombok.*;

/**
 * Join entity linking actors to movies with the played role.
 */
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
