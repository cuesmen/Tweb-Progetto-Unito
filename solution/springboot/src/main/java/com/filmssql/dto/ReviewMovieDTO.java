package com.filmssql.dto;

import java.time.LocalDate;

/** Critic review payload for a movie. */
public record ReviewMovieDTO(
        Long id,
        Long movieId,
        String critic_name,
        boolean top_critic,
        String publisher_name,
        String review_type,
        String review_score,
        LocalDate review_date,
        String review_content
) {}
