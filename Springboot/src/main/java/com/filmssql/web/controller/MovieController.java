package com.filmssql.web.controller;

import com.filmssql.domain.entity.Movie;
import com.filmssql.domain.service.MovieService;
import com.filmssql.util.Mappers;
import com.filmssql.web.dto.MovieDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.Set;

@RestController
@RequestMapping("/api/movies")
public class MovieController {

    private final MovieService movieService;
    public MovieController(MovieService movieService){ this.movieService = movieService; }

    @GetMapping("/{id}")
    public ResponseEntity<MovieDTO> get(@PathVariable Long id){
        Movie m = movieService.get(id);
        try {
            return ResponseEntity.ok(Mappers.toDTO(m));
        } catch (Exception e) {
            e.printStackTrace();
            throw e;
        }
    }

    @PostMapping
    public ResponseEntity<MovieDTO> create(@RequestBody MovieDTO dto){
        Movie m = new Movie();
        m.setName(dto.name());
        m.setDate(dto.date());
        m.setTagline(dto.tagline());
        m.setDescription(dto.description());
        m.setMinute(dto.minute());
        m.setRating(dto.rating());
        Movie saved = movieService.save(m);

        if(dto.genreIds()!=null) movieService.attachGenres(saved.getId(), dto.genreIds());
        if(dto.studioIds()!=null) movieService.attachStudios(saved.getId(), dto.studioIds());
        if(dto.countryIds()!=null) movieService.attachCountries(saved.getId(), dto.countryIds());
        if(dto.languageIds()!=null) movieService.attachLanguages(saved.getId(), dto.languageIds());

        return ResponseEntity.created(URI.create("/api/movies/"+saved.getId())).body(Mappers.toDTO(movieService.get(saved.getId())));
    }

    @PutMapping("/{id}")
    public ResponseEntity<MovieDTO> update(@PathVariable Long id, @RequestBody MovieDTO dto){
        Movie m = movieService.get(id);
        if(dto.name()!=null) m.setName(dto.name());
        m.setDate(dto.date());
        m.setTagline(dto.tagline());
        m.setDescription(dto.description());
        m.setMinute(dto.minute());
        m.setRating(dto.rating());
        movieService.save(m);

        if(dto.genreIds()!=null) movieService.attachGenres(id, dto.genreIds());
        if(dto.studioIds()!=null) movieService.attachStudios(id, dto.studioIds());
        if(dto.countryIds()!=null) movieService.attachCountries(id, dto.countryIds());
        if(dto.languageIds()!=null) movieService.attachLanguages(id, dto.languageIds());

        return ResponseEntity.ok(Mappers.toDTO(movieService.get(id)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id){
        movieService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/genres")
    public ResponseEntity<MovieDTO> setGenres(@PathVariable Long id, @RequestBody Set<Long> genreIds){
        return ResponseEntity.ok(Mappers.toDTO(movieService.attachGenres(id, genreIds)));
    }
}
