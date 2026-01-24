package com.filmssql.domain.service;

import com.filmssql.domain.entity.OscarAward;
import com.filmssql.domain.repository.OscarAwardRepository;
import com.filmssql.exception.NotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Service for querying Oscar awards by actor or movie.
 */
@Service
public class OscarAwardService {

    private final OscarAwardRepository oscarAwardRepository;

    public OscarAwardService(OscarAwardRepository oscarAwardRepository) {
        this.oscarAwardRepository = oscarAwardRepository;
    }

    /**
     * Awards won or nominated by a specific actor.
     * @throws NotFoundException when none exist.
     */
    @Transactional(readOnly = true)
    public List<OscarAward> getByActor(Long actorId) {
        List<OscarAward> awards = oscarAwardRepository.findAllByActorId(actorId);
        if (awards.isEmpty()) {
            throw new NotFoundException("Oscar awards for actor %d not found".formatted(actorId));
        }
        return awards;
    }

    /**
     * Awards tied to a given movie.
     * @throws NotFoundException when none exist.
     */
    @Transactional(readOnly = true)
    public List<OscarAward> getByMovie(Long movieId) {
        List<OscarAward> awards = oscarAwardRepository.findAllByMovieId(movieId);
        if (awards.isEmpty()) {
            throw new NotFoundException("Oscar awards for movie %d not found".formatted(movieId));
        }
        return awards;
    }
}
