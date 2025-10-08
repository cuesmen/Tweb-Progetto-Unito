package com.filmssql.domain.service;

import com.filmssql.domain.entity.*;
import com.filmssql.domain.repository.*;
import com.filmssql.web.exception.NotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LookupService {
    private final GenreRepository genreRepository;
    private final StudioRepository studioRepository;
    private final CountryRepository countryRepository;
    private final LanguageRepository languageRepository;
    private final RoleRepository roleRepository;

    public LookupService(GenreRepository genreRepository, StudioRepository studioRepository,
                         CountryRepository countryRepository, LanguageRepository languageRepository,
                         RoleRepository roleRepository) {
        this.genreRepository = genreRepository;
        this.studioRepository = studioRepository;
        this.countryRepository = countryRepository;
        this.languageRepository = languageRepository;
        this.roleRepository = roleRepository;
    }

    public List<Genre> listGenres() { return genreRepository.findAll(); }
    public List<Studio> listStudios() { return studioRepository.findAll(); }
    public List<Country> listCountries() { return countryRepository.findAll(); }
    public List<Language> listLanguages() { return languageRepository.findAll(); }
    public List<Role> listRoles() { return roleRepository.findAll(); }

    public Genre getGenre(Long id){ return genreRepository.findById(id).orElseThrow(()-> new NotFoundException("Genre not found")); }
    public Studio getStudio(Long id){ return studioRepository.findById(id).orElseThrow(()-> new NotFoundException("Studio not found")); }
    public Country getCountry(Long id){ return countryRepository.findById(id).orElseThrow(()-> new NotFoundException("Country not found")); }
    public Language getLanguage(Long id){ return languageRepository.findById(id).orElseThrow(()-> new NotFoundException("Language not found")); }
    public Role getRole(Long id){ return roleRepository.findById(id).orElseThrow(()-> new NotFoundException("Role not found")); }

    public Genre saveGenre(Genre g){ return genreRepository.save(g); }
    public Studio saveStudio(Studio s){ return studioRepository.save(s); }
    public Country saveCountry(Country c){ return countryRepository.save(c); }
    public Language saveLanguage(Language l){ return languageRepository.save(l); }
    public Role saveRole(Role r){ return roleRepository.save(r); }

    public void deleteGenre(Long id){ genreRepository.delete(getGenre(id)); }
    public void deleteStudio(Long id){ studioRepository.delete(getStudio(id)); }
    public void deleteCountry(Long id){ countryRepository.delete(getCountry(id)); }
    public void deleteLanguage(Long id){ languageRepository.delete(getLanguage(id)); }
    public void deleteRole(Long id){ roleRepository.delete(getRole(id)); }
}
