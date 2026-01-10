package com.filmssql.domain.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "actor_infos")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ActorInfo {

    @Id
    @Column(name = "actor_id")
    private Long actorId;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @MapsId
    @JoinColumn(
            name = "actor_id",
            foreignKey = @ForeignKey(name = "actor_infos_actor_id_fkey")
    )
    private Actor actor;

    @Column(columnDefinition = "text")
    private String biography;

    @Column(name = "place_of_birth", columnDefinition = "text")
    private String placeOfBirth;

    private LocalDate birthday;

    @Column(name = "name", length = 255)
    private String infoName;

    private Integer gender;

    private Double popularity;

    private LocalDate deathday;

    @Column(name = "image_path", length = 255)
    private String imagePath;
}
