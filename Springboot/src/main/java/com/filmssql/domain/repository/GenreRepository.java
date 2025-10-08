package com.filmssql.domain.repository;

import com.filmssql.domain.entity.Genre;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface GenreRepository extends JpaRepository<Genre, Long> {
    Optional<Genre> findByGenre(String genre);
}
