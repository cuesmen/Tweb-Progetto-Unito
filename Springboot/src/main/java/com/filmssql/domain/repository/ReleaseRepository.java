package com.filmssql.domain.repository;

import com.filmssql.domain.entity.Release_Movies;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReleaseRepository extends JpaRepository<Release_Movies, Long> {}
