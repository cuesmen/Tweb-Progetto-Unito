package com.filmssql.domain.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "actor")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Actor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @OneToOne(mappedBy = "actor", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private ActorInfo info;

    public void attachInfo(ActorInfo info) {
        this.info = info;
        if (info != null) info.setActor(this);
    }
}
