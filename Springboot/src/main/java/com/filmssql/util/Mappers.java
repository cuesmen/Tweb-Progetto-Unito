package com.filmssql.util;

import com.filmssql.domain.entity.*;
import com.filmssql.web.dto.*;

import java.util.LinkedHashSet;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

public final class Mappers {
    private Mappers() {}

    public static MovieDTO toDTO(Movie m) {
        return new MovieDTO(
                m.getId(),
                m.getName(),
                m.getDate(),
                m.getTagline(),
                m.getDescription(),
                m.getMinute(),
                m.getRating(),

                toPosterDTO(m.getPoster()),
                toThemeDTOs(m.getThemes()),
                toCastDTOs(m.getCast()),
                toCrewDTOs(m.getCrew()),
                toReleaseDTOs(m.getReleases()),

                toGenreDTOs(m.getGenres()),
                toStudioDTOs(m.getStudios()),
                toCountryDTOs(m.getCountries()),
                toLanguageDTOs(m.getLanguages())
        );
    }

    private static PosterDTO toPosterDTO(Poster p) {
        if (p == null) return null;
        return new PosterDTO(p.getId(), p.getLink());
    }

    private static Set<ThemeDTO> toThemeDTOs(Set<Theme> themes) {
        return safeSet(themes).stream()
                .map(t -> new ThemeDTO(t.getId(), t.getTheme()))
                .collect(Collectors.toCollection(LinkedHashSet::new));
    }

    private static Set<CastDTO> toCastDTOs(Set<ActorMovie> cast) {
        return cast == null ? new LinkedHashSet<>() :
                cast.stream()
                        .map(am -> {
                            var actor = am.getActor();
                            var info  = actor != null ? actor.getInfo() : null;
                            return CastDTO.builder()
                                    .id(am.getId())
                                    .actorId(actor != null ? actor.getId() : null)
                                    .actorName(actor != null ? actor.getName() : null)
                                    .role(am.getRole())
                                    .imagePath(info != null ? info.getImagePath() : null)
                                    .build();
                        })
                        .collect(java.util.stream.Collectors.toCollection(LinkedHashSet::new));
    }


    private static Set<CrewCreditDTO> toCrewDTOs(Set<MovieRolePerson> crew) {
        return safeSet(crew).stream()
                .map(c -> new CrewCreditDTO(
                        c.getPerson() != null ? c.getPerson().getId() : null,
                        c.getPerson() != null ? c.getPerson().getName() : null,
                        c.getRole() != null ? c.getRole().getId() : null,
                        c.getRole() != null ? c.getRole().getRole() : null
                ))
                .collect(Collectors.toCollection(LinkedHashSet::new));
    }

    private static Set<ReleaseDTO> toReleaseDTOs(Set<ReleaseMovie> releases) {
        return safeSet(releases).stream()
                .map(r -> new ReleaseDTO(
                        r.getId(),
                        r.getCountry() != null ? new CountryDTO(r.getCountry().getId(), r.getCountry().getCountry()) : null,
                        r.getReleaseDate(),
                        r.getReleaseType(),
                        r.getRating()
                ))
                .collect(Collectors.toCollection(LinkedHashSet::new));
    }

    private static Set<GenreDTO> toGenreDTOs(Set<Genre> genres) {
        return safeSet(genres).stream()
                .map(g -> new GenreDTO(g.getId(), g.getGenre()))
                .collect(Collectors.toCollection(LinkedHashSet::new));
    }

    private static Set<StudioDTO> toStudioDTOs(Set<Studio> studios) {
        return safeSet(studios).stream()
                .map(s -> new StudioDTO(s.getId(), s.getName()))
                .collect(Collectors.toCollection(LinkedHashSet::new));
    }

    private static Set<CountryDTO> toCountryDTOs(Set<Country> countries) {
        return safeSet(countries).stream()
                .map(c -> new CountryDTO(c.getId(), c.getCountry()))
                .collect(Collectors.toCollection(LinkedHashSet::new));
    }

    private static Set<LanguageDTO> toLanguageDTOs(Set<Language> languages) {
        return safeSet(languages).stream()
                .map(l -> new LanguageDTO(l.getId(), l.getLanguage()))
                .collect(Collectors.toCollection(LinkedHashSet::new));
    }

    private static <T> Set<T> safeSet(Set<T> input) {
        return input == null ? new LinkedHashSet<>() : input.stream()
                .filter(Objects::nonNull)
                .collect(Collectors.toCollection(LinkedHashSet::new));
    }
}
