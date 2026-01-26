package com.filmssql.OscarAward.dto;
import com.filmssql.ActorInfo.ActorInfo;
import com.filmssql.OscarAward.OscarAward;

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
