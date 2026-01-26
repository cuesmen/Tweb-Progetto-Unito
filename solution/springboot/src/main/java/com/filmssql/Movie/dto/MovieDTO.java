package com.filmssql.Movie.dto;

import com.filmssql.Country.dto.CountryDTO;
import com.filmssql.Genere.dto.GenreDTO;
import com.filmssql.Language.dto.LanguageDTO;
import com.filmssql.MovieRolePerson.dto.MovieRolePersonDTO;
import com.filmssql.Person.dto.PersonDTO;
import com.filmssql.Poster.dto.PosterDTO;
import com.filmssql.ReleaseMovie.dto.ReleaseDTO;
import com.filmssql.Studio.dto.StudioDTO;
import com.filmssql.Theme.dto.ThemeDTO;

import java.util.Set;

/** Full movie payload with aggregates. */
public record MovieDTO(
        Long id,
        String name,
        Integer date,
        String tagline,
        String description,
        Integer minute,
        Double rating,

        PosterDTO poster,
        Set<ThemeDTO> themes,
        Set<PersonDTO> cast,
        Set<MovieRolePersonDTO> crew,
        Set<ReleaseDTO> releases,

        Set<GenreDTO> genres,
        Set<StudioDTO> studios,
        Set<CountryDTO> countries,
        Set<LanguageDTO> languages
) {}
