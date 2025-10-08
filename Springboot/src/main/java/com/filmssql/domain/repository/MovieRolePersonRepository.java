package com.filmssql.domain.repository;

import com.filmssql.domain.entity.MovieRolePerson;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MovieRolePersonRepository extends JpaRepository<MovieRolePerson, Long> {}
