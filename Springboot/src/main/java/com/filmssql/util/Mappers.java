package com.filmssql.util;

import com.filmssql.domain.entity.*;
import com.filmssql.web.dto.MovieDTO;

import java.util.Set;
import java.util.stream.Collectors;

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
                m.getGenres().stream().map(Genre::getId).collect(Collectors.toSet()),
                m.getStudios().stream().map(Studio::getId).collect(Collectors.toSet()),
                m.getCountries().stream().map(Country::getId).collect(Collectors.toSet()),
                m.getLanguages().stream().map(Language::getId).collect(Collectors.toSet())
        );
    }
}
