package com.filmssql.Language;

import jakarta.persistence.*;
import lombok.*;

/**
 * Language reference used in movie metadata.
 */
@Entity
@Table(name = "language")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Language {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String language;
}
