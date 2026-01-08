package com.filmssql.web.controller;

import com.filmssql.domain.service.ReviewMovieService;
import com.filmssql.util.Mappers;
import com.filmssql.web.dto.ReviewMovieDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/reviewmovie")
public class ReviewMovieController
{
    private final ReviewMovieService reviewMovieService;
    public ReviewMovieController(ReviewMovieService reviewMovieService){ this.reviewMovieService = reviewMovieService; }

    @GetMapping("/{movie_id}")
    public ResponseEntity<List<ReviewMovieDTO>> get(@PathVariable("movie_id") Long movieId){
        List<ReviewMovieDTO> body = reviewMovieService.getReviews(movieId).stream()
                .map(Mappers::toReviewMovieDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(body);
    }
}
