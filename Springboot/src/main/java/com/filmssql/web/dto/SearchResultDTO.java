package com.filmssql.web.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SearchResultDTO {
    private Long id;
    private String type;    // "movie" or "actor"
    private String title;
    private String imageUrl;
}
