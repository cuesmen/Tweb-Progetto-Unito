package com.filmssql.util;

import com.filmssql.domain.entity.*;
import com.filmssql.web.dto.MovieDTO;

import java.util.LinkedHashSet;

import static java.util.stream.Collectors.toCollection;

public class Mappers {
    private Mappers(){}

    public static MovieDTO toDTO(Movie m){
        return new MovieDTO(
                m.getId(),
                m.getName(),
                m.getDate(),
                m.getTagline(),
                m.getDescription(),
                m.getMinute(),
                m.getRating(),
                m.getGenres().stream().map(Genre::getId).collect(toCollection(LinkedHashSet::new)),
                m.getStudios().stream().map(Studio::getId).collect(toCollection(LinkedHashSet::new)),
                m.getCountries().stream().map(Country::getId).collect(toCollection(LinkedHashSet::new)),
                m.getLanguages().stream().map(Language::getId).collect(toCollection(LinkedHashSet::new))
        );
    }
}
