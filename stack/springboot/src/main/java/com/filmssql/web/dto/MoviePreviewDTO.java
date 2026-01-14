package com.filmssql.web.dto;

/** Lightweight movie preview payload. */
public record MoviePreviewDTO(
        Long id,
        String name,
        Integer date,
        String description,
        Double rating,
        PosterDTO poster
) { }
