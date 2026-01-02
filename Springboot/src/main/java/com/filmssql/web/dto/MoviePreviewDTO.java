package com.filmssql.web.dto;

public record MoviePreviewDTO(
        Long id,
        String name,
        Integer date,
        String description,
        Double rating,
        PosterDTO poster
) { }
