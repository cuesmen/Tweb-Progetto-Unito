package com.filmssql.domain.service;

import com.filmssql.domain.entity.*;
import com.filmssql.domain.repository.*;
import com.filmssql.util.Mappers;
import com.filmssql.dto.MovieDTO;
import com.filmssql.dto.MoviePreviewDTO;
import com.filmssql.dto.SearchResultDTO;
import com.filmssql.exception.NotFoundException;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.concurrent.ThreadLocalRandom;

/**
 * Service handling movie retrieval, enrichment, previews and associations.
 */
@Service
public class MovieService {

    private final MovieRepository movieRepository;
    private final GenreRepository genreRepository;
    private final StudioRepository studioRepository;
    private final CountryRepository countryRepository;
    private final LanguageRepository languageRepository;

    public MovieService(MovieRepository movieRepository,
                        GenreRepository genreRepository,
                        StudioRepository studioRepository,
                        CountryRepository countryRepository,
                        LanguageRepository languageRepository) {
        this.movieRepository = movieRepository;
        this.genreRepository = genreRepository;
        this.studioRepository = studioRepository;
        this.countryRepository = countryRepository;
        this.languageRepository = languageRepository;
    }

    /**
     * Loads a movie with related aggregates (cast, crew, genres, studios, countries, languages).
     * @param id movie id.
     * @return DTO with relations.
     */
    @Transactional(readOnly = true)
    public MovieDTO getDto(Long id) {
        Movie m = movieRepository.findBaseById(id)
                .orElseThrow(() -> new NotFoundException("Movie %d not found".formatted(id)));

        m = movieRepository.fetchCast(id).orElse(m);
        m = movieRepository.fetchCrew(id).orElse(m);
        m = movieRepository.fetchGenres(id).orElse(m);
        m = movieRepository.fetchStudios(id).orElse(m);
        m = movieRepository.fetchCountries(id).orElse(m);
        m = movieRepository.fetchLanguages(id).orElse(m);

        return Mappers.toDTO(m);
    }

    @Transactional(readOnly = true)
    public Movie getEntity(Long id) {
        return movieRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Movie %d not found".formatted(id)));
    }

    /**
     * Persist or update a movie.
     */
    public Movie save(Movie movie) {
        return movieRepository.save(movie);
    }

    /**
     * Delete a movie by id.
     */
    public void delete(Long id) {
        movieRepository.delete(getEntity(id));
    }

    /**
     * Replace genres associated to a movie.
     */
    @Transactional
    public MovieDTO attachGenres(Long movieId, Set<Long> genreIds) {
        Movie m = getEntity(movieId);
        Set<Genre> gs = new HashSet<>(genreRepository.findAllById(genreIds));
        m.getGenres().clear();
        m.getGenres().addAll(gs);
        return Mappers.toDTO(m);
    }

    /**
     * Replace studios associated to a movie.
     */
    @Transactional
    public MovieDTO attachStudios(Long movieId, Set<Long> studioIds) {
        Movie m = getEntity(movieId);
        Set<Studio> ss = new HashSet<>(studioRepository.findAllById(studioIds));
        m.getStudios().clear();
        m.getStudios().addAll(ss);
        return Mappers.toDTO(m);
    }

    /**
     * Replace production countries associated to a movie.
     */
    @Transactional
    public MovieDTO attachCountries(Long movieId, Set<Long> ids) {
        Movie m = getEntity(movieId);
        Set<Country> ss = new HashSet<>(countryRepository.findAllById(ids));
        m.getCountries().clear();
        m.getCountries().addAll(ss);
        return Mappers.toDTO(m);
    }

    /**
     * Replace languages associated to a movie.
     */
    @Transactional
    public MovieDTO attachLanguages(Long movieId, Set<Long> ids) {
        Movie m = getEntity(movieId);
        Set<Language> ss = new HashSet<>(languageRepository.findAllById(ids));
        m.getLanguages().clear();
        m.getLanguages().addAll(ss);
        return Mappers.toDTO(m);
    }

    /**
     * Search movies returning lightweight preview search results.
     */
    public List<SearchResultDTO> searchPreview(String query, int limit) {
        return movieRepository.findByNameContainingIgnoreCase(query, PageRequest.of(0, limit))
                .stream()
                .map(m -> new SearchResultDTO(
                        m.getId(),
                        "movie",
                        m.getName(),
                        m.getPoster() != null ? m.getPoster().getLink() : null
                ))
                .toList();
    }

    @Transactional(readOnly = true)
    public MoviePreviewDTO getPreviewDto(Long id) {
        return movieRepository.findPreviewById(id)
                .orElseThrow(() -> new NotFoundException("Movie %d not found".formatted(id)));
    }

    /**
     * Pick a random high-rated movie and return its preview DTO.
     */
    @Transactional(readOnly = true)
    public MoviePreviewDTO getRandomPreviewDto() {
        long total = movieRepository.countAllMoviesWithHighRating();
        if (total <= 0) throw new NotFoundException("No high-rated movies available");

        long off = ThreadLocalRandom.current().nextLong(total);
        Long id = movieRepository.findHighRatedIdByOffset(off);

        if (id == null) id = movieRepository.findHighRatedIdByOffset(Math.max(0, total - 1));
        return getPreviewDto(id);
    }


    @Transactional(readOnly = true)
    public List<MoviePreviewDTO> getTopRated(int limit) {
        return movieRepository.findTopRated(PageRequest.of(0, limit));
    }

    /**
     * Latest movies ordered by date.
     */
    @Transactional(readOnly = true)
    public List<MoviePreviewDTO> getLatest(int limit) {
        return movieRepository.findLatest(PageRequest.of(0, limit));
    }

}
