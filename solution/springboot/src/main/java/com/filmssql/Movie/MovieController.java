package com.filmssql.Movie;

import com.filmssql.Movie.dto.MovieDTO;
import com.filmssql.Movie.dto.MoviePreviewDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST endpoints for movies: details, previews, and listings.
 */
@RestController
@RequestMapping("/api/movies")
public class MovieController {

    private static final Logger log = LoggerFactory.getLogger(MovieController.class);

    private final MovieService movieService;
    public MovieController(MovieService movieService){ this.movieService = movieService; }

    /**
     * Returns full movie details.
     */
    @GetMapping("/{id}")
    public ResponseEntity<MovieDTO> get(@PathVariable Long id){
        return ResponseEntity.ok(movieService.getDto(id));
    }

    /**
     * Returns a preview for a movie.
     */
    @GetMapping("/{id}/preview")
    public ResponseEntity<MoviePreviewDTO> getPreview(@PathVariable Long id){
        return ResponseEntity.ok(movieService.getPreviewDto(id));
    }

    /**
     * Returns a random high-rated movie preview.
     */
    @GetMapping("/random")
    public ResponseEntity<MoviePreviewDTO> random(){
        return ResponseEntity.ok(movieService.getRandomPreviewDto());
    }

    /**
     * Top-rated movie previews.
     */
    @GetMapping("/top-rated")
    public ResponseEntity<List<MoviePreviewDTO>> topRated(
            @RequestParam(defaultValue = "10") int limit) {
        long started = System.currentTimeMillis();
        try {
            List<MoviePreviewDTO> data = movieService.getTopRated(limit);
            log.info("GET /api/movies/top-rated limit={} -> {} items in {}ms", limit, data.size(), System.currentTimeMillis() - started);
            return ResponseEntity.ok(data);
        } catch (Exception e) {
            log.error("GET /api/movies/top-rated limit={} failed after {}ms", limit, System.currentTimeMillis() - started, e);
            throw e;
        }
    }

    /**
     * Latest movie previews.
     */
    @GetMapping("/latest")
    public ResponseEntity<List<MoviePreviewDTO>> latest(
            @RequestParam(defaultValue = "10") int limit) {
        long started = System.currentTimeMillis();
        try {
            List<MoviePreviewDTO> data = movieService.getLatest(limit);
            log.info("GET /api/movies/latest limit={} -> {} items in {}ms", limit, data.size(), System.currentTimeMillis() - started);
            return ResponseEntity.ok(data);
        } catch (Exception e) {
            log.error("GET /api/movies/latest limit={} failed after {}ms", limit, System.currentTimeMillis() - started, e);
            throw e;
        }
    }

}
