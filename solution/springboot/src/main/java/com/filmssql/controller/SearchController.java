package com.filmssql.controller;

import com.filmssql.domain.service.SearchService;
import com.filmssql.dto.SearchResultDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Combined search endpoints for movies and actors.
 */
@RestController
@RequestMapping("/api/search")
@RequiredArgsConstructor
public class SearchController {

    private final SearchService searchService;

    /**
     * Performs a search across selected resource types.
     */
    @GetMapping
    public List<SearchResultDTO> search(
            @RequestParam String query,
            @RequestParam(defaultValue = "movie,actor") String type,
            @RequestParam(defaultValue = "10") int limit
    ) {
        return searchService.search(query, type, limit);
    }
}
