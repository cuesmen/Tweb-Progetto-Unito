package com.filmssql.domain.controller;

import com.filmssql.domain.service.OscarAwardService;
import com.filmssql.util.MovieMapper;
import com.filmssql.domain.dto.OscarAwardDTO;
import com.filmssql.util.OscarAwardMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

/**
 * REST endpoints for Oscar award lookups by actor or movie.
 */
@RestController
@RequestMapping("/api/oscaraward")
public class OscarAwardController {

    private final OscarAwardService oscarAwardService;

    public OscarAwardController(OscarAwardService oscarAwardService) {
        this.oscarAwardService = oscarAwardService;
    }

    /**
     * All Oscar awards for the given actor.
     */
    @GetMapping("/actor/{actor_id}")
    public ResponseEntity<List<OscarAwardDTO>> getByActor(@PathVariable("actor_id") Long actorId) {
        List<OscarAwardDTO> body = oscarAwardService.getByActor(actorId).stream()
                .map(OscarAwardMapper::toOscarAwardDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(body);
    }

    /**
     * All Oscar awards for the given movie.
     */
    @GetMapping("/movie/{movie_id}")
    public ResponseEntity<List<OscarAwardDTO>> getByMovie(@PathVariable("movie_id") Long movieId) {
        List<OscarAwardDTO> body = oscarAwardService.getByMovie(movieId).stream()
                .map(OscarAwardMapper::toOscarAwardDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(body);
    }
}
