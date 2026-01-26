package com.filmssql.domain.dto;

/** Crew member credit payload. */
public record CrewCreditDTO(
        Long personId,
        String personName,
        Long roleId,
        String roleName
) {}
