package com.filmssql.domain.repository;

import com.filmssql.domain.entity.Poster;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PosterRepository extends JpaRepository<Poster, Long> {}
