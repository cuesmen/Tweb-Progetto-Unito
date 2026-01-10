package com.filmssql.web.dto;

import java.time.LocalDate;

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
