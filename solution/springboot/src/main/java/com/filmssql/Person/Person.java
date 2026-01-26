package com.filmssql.Person;

import jakarta.persistence.*;
import lombok.*;

/**
 * Generic person entity used for crew credits.
 */
@Entity
@Table(name = "person")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Person {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;
}
