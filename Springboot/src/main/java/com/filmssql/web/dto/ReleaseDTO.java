package com.filmssql.web.dto;

import java.time.LocalDate;

public record ReleaseDTO(
        Long id,
        CountryDTO country,
        LocalDate releaseDate,
        String releaseType,
        String rating
) {}
