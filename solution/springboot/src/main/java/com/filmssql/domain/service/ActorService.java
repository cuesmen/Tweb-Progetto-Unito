package com.filmssql.domain.service;

import com.filmssql.domain.dto.SearchResultDTO;
import com.filmssql.domain.repository.ActorRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;

import java.util.List;

/**
 * Service for actor-related operations and search previews.
 */
@Service
@RequiredArgsConstructor
public class ActorService {

    private final ActorRepository actorRepository;

    /**
     * Returns lightweight search results for actors matching the query.
     * @param query partial name match.
     * @param limit max results.
     */
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
