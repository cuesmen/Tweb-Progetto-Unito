package com.filmssql.domain.service;

import com.filmssql.domain.entity.*;
import com.filmssql.domain.repository.*;
import com.filmssql.web.exception.NotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Set;

@Service
public class MovieService {
    private final MovieRepository movieRepository;
    private final GenreRepository genreRepository;
    private final StudioRepository studioRepository;
    private final CountryRepository countryRepository;
    private final LanguageRepository languageRepository;

    public MovieService(MovieRepository movieRepository, GenreRepository genreRepository, StudioRepository studioRepository,
                        CountryRepository countryRepository, LanguageRepository languageRepository) {
        this.movieRepository = movieRepository;
        this.genreRepository = genreRepository;
        this.studioRepository = studioRepository;
        this.countryRepository = countryRepository;
        this.languageRepository = languageRepository;
    }

    public Movie get(Long id) {
        return movieRepository.findById(id).orElseThrow(() -> new NotFoundException("Movie %d not found".formatted(id)));
    }

    public Movie save(Movie movie) {
        return movieRepository.save(movie);
    }

    public void delete(Long id) {
        movieRepository.delete(get(id));
    }

    @Transactional
    public Movie attachGenres(Long movieId, Set<Long> genreIds) {
        Movie m = get(movieId);
        Set<Genre> gs = new HashSet<>(genreRepository.findAllById(genreIds));
        m.getGenres().clear();
        m.getGenres().addAll(gs);
        return m;
    }

    @Transactional
    public Movie attachStudios(Long movieId, Set<Long> studioIds) {
        Movie m = get(movieId);
        Set<Studio> ss = new HashSet<>(studioRepository.findAllById(studioIds));
        m.getStudios().clear();
        m.getStudios().addAll(ss);
        return m;
    }

    @Transactional
    public Movie attachCountries(Long movieId, Set<Long> ids) {
        Movie m = get(movieId);
        Set<Country> ss = new HashSet<>(countryRepository.findAllById(ids));
        m.getCountries().clear();
        m.getCountries().addAll(ss);
        return m;
    }

    @Transactional
    public Movie attachLanguages(Long movieId, Set<Long> ids) {
        Movie m = get(movieId);
        Set<Language> ss = new HashSet<>(languageRepository.findAllById(ids));
        m.getLanguages().clear();
        m.getLanguages().addAll(ss);
        return m;
    }
}
