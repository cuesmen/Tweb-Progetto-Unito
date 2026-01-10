package com.filmssql.domain.repository;

import com.filmssql.domain.entity.Language;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface LanguageRepository extends JpaRepository<Language, Long> {
    Optional<Language> findByLanguage(String language);
}
