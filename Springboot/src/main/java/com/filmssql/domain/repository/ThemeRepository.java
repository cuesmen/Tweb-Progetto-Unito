package com.filmssql.domain.repository;

import com.filmssql.domain.entity.Theme;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ThemeRepository extends JpaRepository<Theme, Long> {}
