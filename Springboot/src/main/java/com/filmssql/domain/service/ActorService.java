package com.filmssql.domain.service;

import com.filmssql.domain.entity.Actor;
import com.filmssql.web.dto.SearchResultDTO;
import com.filmssql.domain.repository.ActorRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ActorService {

    private final ActorRepository actorRepository;

    public List<SearchResultDTO> searchPreview(String query, int limit) {
        return actorRepository.findByNameContainingIgnoreCase(query, PageRequest.of(0, limit))
                .stream()
                .map(actor -> new SearchResultDTO(
                        actor.getId(),
                        "actor",
                        actor.getName(),
                        actor.getInfo() != null && actor.getInfo().getImagePath() != null
                                ? actor.getInfo().getImagePath()
                                : null
                ))
                .toList();
    }
}
