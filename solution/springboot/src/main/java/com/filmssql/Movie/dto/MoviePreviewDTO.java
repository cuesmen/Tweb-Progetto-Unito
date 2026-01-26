package com.filmssql.Movie.dto;

import com.filmssql.Poster.dto.PosterDTO;

/** Lightweight movie preview payload. */
public record MoviePreviewDTO(
        Long id,
        String name,
        Integer date,
        String description,
        Double rating,
        PosterDTO poster
) { }
