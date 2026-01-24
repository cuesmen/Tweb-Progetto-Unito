package com.filmssql.dto;

import lombok.*;

/**
 * Cast entry linking an actor to a movie role.
 */
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class CastDTO {
    private Long id;
    private Long actorId;
    private String actorName;
    private String role;
    private String imagePath;
}
