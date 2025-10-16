package com.filmssql.web.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class CastDTO {
    private Long id;
    private Long actorId;
    private String actorName;
    private String role;
    private String imagePath;
}
