package com.filmssql.domain.repository;

import com.filmssql.domain.entity.Actor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface ActorRepository extends JpaRepository<Actor, Long>
{

    @Query("SELECT a FROM Actor a LEFT JOIN FETCH a.info WHERE LOWER(a.name) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Actor> searchByName(@Param("query") String query, Pageable pageable);

    List<Actor> findByNameContainingIgnoreCase(String name, Pageable pageable);
}
