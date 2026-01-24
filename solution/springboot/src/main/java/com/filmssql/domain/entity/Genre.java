package com.filmssql.domain.entity;

import jakarta.persistence.*;
import lombok.*;

/**
 * Movie genre reference (e.g., Drama, Comedy).
 */
@Entity
@Table(name = "genre")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Genre {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String genre;
}
