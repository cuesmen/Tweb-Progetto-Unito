package com.filmssql.domain.repository;

import com.filmssql.domain.entity.ActorMovie;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ActorMovieRepository extends JpaRepository<ActorMovie, Long> {}
