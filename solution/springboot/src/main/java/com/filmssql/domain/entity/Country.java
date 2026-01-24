package com.filmssql.domain.entity;

import jakarta.persistence.*;
import lombok.*;

/**
 * Country reference used for movie releases and production metadata.
 */
@Entity
@Table(name = "country")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Country {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String country;
}
