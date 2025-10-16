package com.filmssql.web.dto;

import lombok.*;
import java.time.LocalDate;

@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class ActorInfoDTO {
    private Long actorId;
    private String biography;
    private String placeOfBirth;
    private LocalDate birthday;
    private String name;
    private Integer gender;
    private Double popularity;
    private LocalDate deathday;
    private String imagePath;
}
