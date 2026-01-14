package com.filmssql.domain.repository;

import com.filmssql.domain.entity.Studio;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

/**
 * Repository for {@link Studio}.
 */
public interface StudioRepository extends JpaRepository<Studio, Long> {
    Optional<Studio> findByName(String name);
}
