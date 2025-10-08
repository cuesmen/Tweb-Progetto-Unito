package com.filmssql.domain.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "movie_role_person")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class MovieRolePerson {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false) @JoinColumn(name = "movie_id")
    private Movie movie;

    @ManyToOne(optional = false) @JoinColumn(name = "role_id")
    private Role role;

    @ManyToOne(optional = false) @JoinColumn(name = "person_id")
    private Person person;
}
