package com.filmssql.dto;

/** Lightweight movie preview payload. */
public record MoviePreviewDTO(
        Long id,
        String name,
        Integer date,
        String description,
        Double rating,
        PosterDTO poster
) { }
