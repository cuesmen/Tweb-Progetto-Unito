package com.filmssql.domain.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(
        name = "movie_role_person",
        uniqueConstraints = @UniqueConstraint(columnNames = {"movie_id","role_id","person_id"})
)
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class MovieRolePerson {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch=FetchType.LAZY, optional=false)
    @JoinColumn(name="movie_id", nullable = false)
    private Movie movie;

    @ManyToOne(fetch=FetchType.LAZY, optional=false)
    @JoinColumn(name="role_id", nullable = false)
    private Role role;

    @ManyToOne(fetch=FetchType.LAZY, optional=false)
    @JoinColumn(name="person_id", nullable = false)
    private Person person;
}
