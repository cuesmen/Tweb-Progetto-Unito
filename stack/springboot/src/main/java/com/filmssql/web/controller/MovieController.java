package com.filmssql.web.controller;

import com.filmssql.domain.service.MovieService;
import com.filmssql.web.dto.MovieDTO;
import com.filmssql.web.dto.MoviePreviewDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/movies")
public class MovieController {

    private final MovieService movieService;
    public MovieController(MovieService movieService){ this.movieService = movieService; }

    @GetMapping("/{id}")
    public ResponseEntity<MovieDTO> get(@PathVariable Long id){
        return ResponseEntity.ok(movieService.getDto(id));
    }

    @GetMapping("/{id}/preview")
    public ResponseEntity<MoviePreviewDTO> getPreview(@PathVariable Long id){
        return ResponseEntity.ok(movieService.getPreviewDto(id));
    }

    @GetMapping("/random")
    public ResponseEntity<MoviePreviewDTO> random(){
        return ResponseEntity.ok(movieService.getRandomPreviewDto());
    }

    @GetMapping("/top-rated")
    public ResponseEntity<List<MoviePreviewDTO>> topRated(
            @RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(movieService.getTopRated(limit));
    }

    @GetMapping("/latest")
    public ResponseEntity<List<MoviePreviewDTO>> latest(
            @RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(movieService.getLatest(limit));
    }

}
