package com.filmssql.web.dto;

import java.time.LocalDate;
import java.util.Set;

public record MovieDTO(
        Long id,
        String name,
        LocalDate date,
        String tagline,
        String description,
        Integer minute,
        Double rating,
        Set<Long> genreIds,
        Set<Long> studioIds,
        Set<Long> countryIds,
        Set<Long> languageIds
) {}
