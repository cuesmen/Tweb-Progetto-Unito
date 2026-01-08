package com.filmssql.domain.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "reviews_movies")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReviewMovie {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch=FetchType.LAZY, optional=false)
    @JoinColumn(name="movie_id", nullable = false)
    private Movie movie;

    @Column
    private String critic_name;

    @Column
    private boolean top_critic;

    @Column
    private String publisher_name;

    @Column
    private String review_type;

    @Column
    private String review_score;

    @Column
    private LocalDate review_date;

    @Column
    private String review_content;
}
