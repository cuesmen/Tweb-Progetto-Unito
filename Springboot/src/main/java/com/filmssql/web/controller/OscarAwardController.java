package com.filmssql.web.controller;

import com.filmssql.domain.service.OscarAwardService;
import com.filmssql.util.Mappers;
import com.filmssql.web.dto.OscarAwardDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/oscaraward")
public class OscarAwardController {

    private final OscarAwardService oscarAwardService;

    public OscarAwardController(OscarAwardService oscarAwardService) {
        this.oscarAwardService = oscarAwardService;
    }

    @GetMapping("/actor/{actor_id}")
    public ResponseEntity<List<OscarAwardDTO>> getByActor(@PathVariable("actor_id") Long actorId) {
        List<OscarAwardDTO> body = oscarAwardService.getByActor(actorId).stream()
                .map(Mappers::toOscarAwardDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(body);
    }

    @GetMapping("/movie/{movie_id}")
    public ResponseEntity<List<OscarAwardDTO>> getByMovie(@PathVariable("movie_id") Long movieId) {
        List<OscarAwardDTO> body = oscarAwardService.getByMovie(movieId).stream()
                .map(Mappers::toOscarAwardDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(body);
    }
}
