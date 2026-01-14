package com.filmssql.domain.entity;

import jakarta.persistence.*;
import lombok.*;

/**
 * Role reference (e.g., Director, Writer) used by crew associations.
 */
@Entity
@Table(name = "role")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Role {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String role;
}
