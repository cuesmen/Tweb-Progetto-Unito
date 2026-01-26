package com.filmssql.OscarAward;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/**
 * Repository for {@link OscarAward}.
 */
public interface OscarAwardRepository extends JpaRepository<OscarAward, Long> {
    List<OscarAward> findAllByActorId(Long actorId);
    List<OscarAward> findAllByMovieId(Long movieId);
}
