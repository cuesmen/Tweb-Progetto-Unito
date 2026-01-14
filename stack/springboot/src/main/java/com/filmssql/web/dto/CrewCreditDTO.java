package com.filmssql.web.dto;

/** Crew member credit payload. */
public record CrewCreditDTO(
        Long personId,
        String personName,
        Long roleId,
        String roleName
) {}
