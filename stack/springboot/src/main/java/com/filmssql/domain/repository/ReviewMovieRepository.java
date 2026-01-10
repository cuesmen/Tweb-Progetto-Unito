package com.filmssql.domain.repository;

import com.filmssql.domain.entity.ReviewMovie;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewMovieRepository extends JpaRepository<ReviewMovie, Long>

{
    List<ReviewMovie> findAllByMovieId(Long movieId);
}
