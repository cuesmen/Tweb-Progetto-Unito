package com.filmssql.util;
import com.filmssql.domain.entity.ActorInfo;
import com.filmssql.web.dto.ActorInfoDTO;

/**
 * Utility mapper for converting {@link ActorInfo} entities to DTOs.
 */
public final class ActorInfoMapper {
    private ActorInfoMapper() {}

    /**
     * Maps an {@link ActorInfo} to its DTO representation.
     * @param ai entity or null.
     * @return DTO or null.
     */
    public static ActorInfoDTO toDto(ActorInfo ai) {
        if (ai == null) return null;
        return ActorInfoDTO.builder()
                .actorId(ai.getActorId())
                .biography(ai.getBiography())
                .placeOfBirth(ai.getPlaceOfBirth())
                .birthday(ai.getBirthday())
                .name(ai.getInfoName())
                .gender(ai.getGender())
                .popularity(ai.getPopularity())
                .deathday(ai.getDeathday())
                .imagePath(ai.getImagePath())
                .build();
    }
}
