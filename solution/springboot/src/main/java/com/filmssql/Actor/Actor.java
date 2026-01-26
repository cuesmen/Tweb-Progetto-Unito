package com.filmssql.Actor;

import com.filmssql.ActorInfo.ActorInfo;
import jakarta.persistence.*;
import lombok.*;

/**
 * Actor participating in movies; linked one-to-one with {@link ActorInfo}.
 */
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

}
