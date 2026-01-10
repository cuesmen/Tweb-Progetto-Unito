package com.filmssql.domain.service;

import com.filmssql.domain.entity.OscarAward;
import com.filmssql.domain.repository.OscarAwardRepository;
import com.filmssql.web.exception.NotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class OscarAwardService {

    private final OscarAwardRepository oscarAwardRepository;

    public OscarAwardService(OscarAwardRepository oscarAwardRepository) {
        this.oscarAwardRepository = oscarAwardRepository;
    }

    @Transactional(readOnly = true)
    public List<OscarAward> getByActor(Long actorId) {
        List<OscarAward> awards = oscarAwardRepository.findAllByActorId(actorId);
        if (awards.isEmpty()) {
            throw new NotFoundException("Oscar awards for actor %d not found".formatted(actorId));
        }
        return awards;
    }

    @Transactional(readOnly = true)
    public List<OscarAward> getByMovie(Long movieId) {
        List<OscarAward> awards = oscarAwardRepository.findAllByMovieId(movieId);
        if (awards.isEmpty()) {
            throw new NotFoundException("Oscar awards for movie %d not found".formatted(movieId));
        }
        return awards;
    }
}
