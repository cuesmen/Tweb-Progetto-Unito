package com.filmssql.Actor;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

/**
 * Repository for {@link Actor} with search helpers.
 */
public interface ActorRepository extends JpaRepository<Actor, Long>
{

    /**
     * Full-text like search loading actor info eagerly.
     * @param query partial name match.
     * @param pageable pagination.
     * @return matching actors with info.
     */
    @Query("SELECT a FROM Actor a LEFT JOIN FETCH a.info WHERE LOWER(a.name) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Actor> searchByName(@Param("query") String query, Pageable pageable);

    /**
     * Simple case-insensitive name search.
     */
    List<Actor> findByNameContainingIgnoreCase(String name, Pageable pageable);
}
