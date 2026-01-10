package com.filmssql.domain.repository;

import com.filmssql.domain.entity.OscarAward;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OscarAwardRepository extends JpaRepository<OscarAward, Long> {
    List<OscarAward> findAllByActorId(Long actorId);
    List<OscarAward> findAllByMovieId(Long movieId);
}
