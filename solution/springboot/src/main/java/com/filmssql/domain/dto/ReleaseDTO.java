package com.filmssql.domain.dto;

import java.time.LocalDate;

/** Release info payload for a movie. */
public record ReleaseDTO(
        Long id,
        CountryDTO country,
        LocalDate releaseDate,
        String releaseType,
        String rating
) {}
