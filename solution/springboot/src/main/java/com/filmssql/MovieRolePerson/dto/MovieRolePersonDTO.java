package com.filmssql.MovieRolePerson.dto;

/** Crew member credit payload. */
public record MovieRolePersonDTO(
        Long personId,
        String personName,
        Long roleId,
        String roleName
) {}
