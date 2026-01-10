package com.filmssql.domain.service;

import com.filmssql.domain.entity.ReviewMovie;
import com.filmssql.domain.repository.ReviewMovieRepository;
import com.filmssql.web.exception.NotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ReviewMovieService
{
    private final ReviewMovieRepository reviewMovieRepository;

    public ReviewMovieService(ReviewMovieRepository reviewMovieRepository) {
        this.reviewMovieRepository = reviewMovieRepository;
    }

    @Transactional(readOnly = true)
    public List<ReviewMovie> getReviews(Long movieId) {
        List<ReviewMovie> reviews = reviewMovieRepository.findAllByMovieId(movieId);
        if (reviews.isEmpty()) {
            throw new NotFoundException("Reviews for movie %d not found".formatted(movieId));
        }
        return reviews;
    }

}
