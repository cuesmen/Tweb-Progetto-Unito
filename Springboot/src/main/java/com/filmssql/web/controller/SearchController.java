package com.filmssql.web.controller;

import com.filmssql.domain.service.SearchService;
import com.filmssql.web.dto.SearchResultDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/search")
@RequiredArgsConstructor
public class SearchController {

    private final SearchService searchService;

    @GetMapping
    public List<SearchResultDTO> search(
            @RequestParam String query,
            @RequestParam(defaultValue = "movie,actor") String type,
            @RequestParam(defaultValue = "10") int limit
    ) {
        return searchService.search(query, type, limit);
    }
}
