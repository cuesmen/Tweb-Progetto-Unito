package com.filmssql.web.controller;

import com.filmssql.domain.entity.*;
import com.filmssql.domain.service.LookupService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/lookup")
public class LookupController {

    private final LookupService service;
    public LookupController(LookupService service){ this.service = service; }

    @GetMapping("/genres")
    public ResponseEntity<?> genres(){ return ResponseEntity.ok(service.listGenres()); }

    @PostMapping("/genres")
    public ResponseEntity<?> createGenre(@RequestBody Genre g){ return ResponseEntity.ok(service.saveGenre(g)); }

    @DeleteMapping("/genres/{id}")
    public ResponseEntity<?> deleteGenre(@PathVariable Long id){ service.deleteGenre(id); return ResponseEntity.noContent().build(); }

    @GetMapping("/studio")
    public ResponseEntity<?> studios(){ return ResponseEntity.ok(service.listStudios()); }

    @PostMapping("/studio")
    public ResponseEntity<?> createStudio(@RequestBody Studio s){ return ResponseEntity.ok(service.saveStudio(s)); }

    @DeleteMapping("/studio/{id}")
    public ResponseEntity<?> deleteStudio(@PathVariable Long id){ service.deleteStudio(id); return ResponseEntity.noContent().build(); }

    @GetMapping("/country")
    public ResponseEntity<?> countries(){ return ResponseEntity.ok(service.listCountries()); }

    @PostMapping("/country")
    public ResponseEntity<?> createCountry(@RequestBody Country c){ return ResponseEntity.ok(service.saveCountry(c)); }

    @DeleteMapping("/country/{id}")
    public ResponseEntity<?> deleteCountry(@PathVariable Long id){ service.deleteCountry(id); return ResponseEntity.noContent().build(); }

    @GetMapping("/language")
    public ResponseEntity<?> languages(){ return ResponseEntity.ok(service.listLanguages()); }

    @PostMapping("/language")
    public ResponseEntity<?> createLanguage(@RequestBody Language l){ return ResponseEntity.ok(service.saveLanguage(l)); }

    @DeleteMapping("/language/{id}")
    public ResponseEntity<?> deleteLanguage(@PathVariable Long id){ service.deleteLanguage(id); return ResponseEntity.noContent().build(); }

    @GetMapping("/roles")
    public ResponseEntity<?> roles(){ return ResponseEntity.ok(service.listRoles()); }

    @PostMapping("/roles")
    public ResponseEntity<?> createRole(@RequestBody Role r){ return ResponseEntity.ok(service.saveRole(r)); }

    @DeleteMapping("/roles/{id}")
    public ResponseEntity<?> deleteRole(@PathVariable Long id){ service.deleteRole(id); return ResponseEntity.noContent().build(); }
}
