package com.filmssql.domain.repository;

import com.filmssql.domain.entity.Movie;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface MovieRepository extends JpaRepository<Movie, Long>
{

    @Query("""
                select distinct m from Movie m
                left join fetch m.poster
                left join fetch m.themes
                left join fetch m.releases r
                left join fetch r.country
                where m.id = :id
            """)
    Optional<Movie> findBaseById(@Param("id") Long id);

    @Query("select distinct m from Movie m left join fetch m.studios where m.id = :id")
    Optional<Movie> fetchStudios(@Param("id") Long id);

    @Query("select distinct m from Movie m left join fetch m.countries where m.id = :id")
    Optional<Movie> fetchCountries(@Param("id") Long id);

    @Query("select distinct m from Movie m left join fetch m.languages where m.id = :id")
    Optional<Movie> fetchLanguages(@Param("id") Long id);

    @Query("""
            select distinct m from Movie m
            left join fetch m.crew c
            left join fetch c.person
            left join fetch c.role
            where m.id = :id
            """)
    Optional<Movie> fetchCrew(@Param("id") Long id);

    @Query("""
              select distinct m from Movie m
              left join fetch m.cast am
              left join fetch am.actor a
              left join fetch a.info ai
              where m.id = :id
            """)
    Optional<Movie> fetchCast(@Param("id") Long id);


    @Query("select distinct m from Movie m left join fetch m.genres where m.id = :id")
    Optional<Movie> fetchGenres(@Param("id") Long id);

    //List<Movie> findByNameContainingIgnoreCase(String name, Pageable pageable);

    @Query("""
            SELECT m
            FROM Movie m
            WHERE LOWER(m.name) LIKE LOWER(CONCAT('%', :name, '%'))
            ORDER BY similarity(m.name, :name) DESC, m.rating DESC NULLS LAST
            """)
    List<Movie> findByNameContainingIgnoreCase(@Param("name") String name, Pageable pageable);

}