package com.filmssql.web.dto;

import java.util.Set;

public record MovieDTO(
        Long id,
        String name,
        int date,
        String tagline,
        String description,
        Integer minute,
        Double rating,

        PosterDTO poster,
        Set<ThemeDTO> themes,
        Set<CastDTO> cast,
        Set<CrewCreditDTO> crew,
        Set<ReleaseDTO> releases,

        Set<GenreDTO> genres,
        Set<StudioDTO> studios,
        Set<CountryDTO> countries,
        Set<LanguageDTO> languages
) {}
