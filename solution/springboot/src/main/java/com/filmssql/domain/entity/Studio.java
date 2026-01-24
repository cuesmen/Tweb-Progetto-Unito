package com.filmssql.domain.entity;

import jakarta.persistence.*;
import lombok.*;

/**
 * Studio/production company reference.
 */
@Entity
@Table(name = "studio")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Studio {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;
}
