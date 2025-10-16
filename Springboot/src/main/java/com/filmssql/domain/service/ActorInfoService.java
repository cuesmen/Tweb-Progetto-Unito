package com.filmssql.domain.service;

import com.filmssql.domain.entity.Actor;
import com.filmssql.domain.entity.ActorInfo;
import com.filmssql.domain.repository.ActorInfoRepository;
import com.filmssql.domain.repository.ActorRepository;
import com.filmssql.web.dto.SearchResultDTO;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ActorInfoService {
    private final ActorRepository actorRepo;
    private final ActorInfoRepository infoRepo;

    @Transactional
    public ActorInfo upsert(Long actorId, ActorInfo payload) {
        Actor actor = actorRepo.findById(actorId)
                .orElseThrow(() -> new IllegalArgumentException("Actor " + actorId + " non esiste"));

        ActorInfo info = infoRepo.findById(actorId).orElseGet(() -> {
            ActorInfo ai = new ActorInfo();
            ai.setActor(actor);
            return ai;
        });

        info.setBiography(payload.getBiography());
        info.setPlaceOfBirth(payload.getPlaceOfBirth());
        info.setBirthday(payload.getBirthday());
        info.setInfoName(payload.getInfoName());
        info.setGender(payload.getGender());
        info.setPopularity(payload.getPopularity());
        info.setDeathday(payload.getDeathday());
        info.setImagePath(payload.getImagePath());

        return infoRepo.save(info);
    }
}
