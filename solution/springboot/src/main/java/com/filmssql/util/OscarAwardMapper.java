package com.filmssql.util;
import com.filmssql.domain.dto.OscarAwardDTO;
import com.filmssql.domain.entity.ActorInfo;
import com.filmssql.domain.dto.ActorInfoDTO;
import com.filmssql.domain.entity.OscarAward;

/**
 * Utility mapper for converting {@link ActorInfo} entities to DTOs.
 */
public final class OscarAwardMapper {
    private OscarAwardMapper() {}

    /**
     * Maps an {@link OscarAward} to its DTO representation.
     * @param award entity or null.
     * @return DTO or null.
     */
    public static OscarAwardDTO toOscarAwardDTO(OscarAward award) {
        if (award == null) return null;
        return new OscarAwardDTO(
                award.getId(),
                award.getYearFilm(),
                award.getYearCeremony(),
                award.getCategory(),
                award.getName(),
                award.getFilm(),
                award.getWinner(),
                award.getActor() != null ? award.getActor().getId() : null,
                award.getMovie() != null ? award.getMovie().getId() : null
        );
    }
}
