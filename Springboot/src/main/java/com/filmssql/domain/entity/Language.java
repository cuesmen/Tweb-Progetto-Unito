package com.filmssql.domain.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "language")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Language {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String type; // e.g., spoken, subtitle

    @Column(nullable = false, unique = true)
    private String language;
}
