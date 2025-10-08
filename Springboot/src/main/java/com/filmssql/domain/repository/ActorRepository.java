package com.filmssql.domain.repository;

import com.filmssql.domain.entity.Actor;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ActorRepository extends JpaRepository<Actor, Long> {}
