package com.filmssql.domain.repository;

import com.filmssql.domain.entity.Country;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

/**
 * Repository for {@link Country}.
 */
public interface CountryRepository extends JpaRepository<Country, Long> {
    Optional<Country> findByCountry(String country);
}
