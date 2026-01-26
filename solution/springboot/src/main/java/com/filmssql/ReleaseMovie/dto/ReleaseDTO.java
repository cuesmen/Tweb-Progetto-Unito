package com.filmssql.ReleaseMovie.dto;

import com.filmssql.Country.dto.CountryDTO;

import java.time.LocalDate;

/** Release info payload for a movie. */
public record ReleaseDTO(
        Long id,
        CountryDTO country,
        LocalDate releaseDate,
        String releaseType,
        String rating
) {}
