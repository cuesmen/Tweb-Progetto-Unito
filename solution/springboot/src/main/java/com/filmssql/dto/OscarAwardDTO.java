package com.filmssql.dto;

/** Oscar award payload. */
public record OscarAwardDTO(
        Long id,
        String yearFilm,
        String yearCeremony,
        String category,
        String name,
        String film,
        Boolean winner,
        Long actorId,
        Long movieId
) {}
