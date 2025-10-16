package com.filmssql.web.controller;

import com.filmssql.domain.service.MovieService;
import com.filmssql.web.dto.MovieDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/movies")
public class MovieController {

    private final MovieService movieService;
    public MovieController(MovieService movieService){ this.movieService = movieService; }

    @GetMapping("/{id}")
    public ResponseEntity<MovieDTO> get(@PathVariable Long id){
        return ResponseEntity.ok(movieService.getDto(id));
    }
}
