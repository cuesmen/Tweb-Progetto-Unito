package com.filmssql.Search;

import com.filmssql.ActorInfo.ActorService;
import com.filmssql.Movie.MovieService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

/**
 * Facade service combining movie and actor search results.
 */
@Service
@RequiredArgsConstructor
public class SearchService {

    private final MovieService movieService;
    private final ActorService actorService;

    /**
     * Combined search across movies and actors depending on requested types.
     */
    public List<SearchResultDTO> search(String query, String type, int limit) {
        List<SearchResultDTO> results = new ArrayList<>();

        if (type.contains("movie")) {
            results.addAll(movieService.searchPreview(query, limit));
        }
        if (type.contains("actor")) {
            results.addAll(actorService.searchPreview(query, limit));
        }

        return results;
    }
}
