package com.filmssql.web.dto;

public record CrewCreditDTO(
        Long personId,
        String personName,
        Long roleId,
        String roleName
) {}
