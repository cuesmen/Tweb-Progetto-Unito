package com.filmssql.domain.repository;

import com.filmssql.domain.entity.ReleaseMovie;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReleaseRepository extends JpaRepository<ReleaseMovie, Long> {}
