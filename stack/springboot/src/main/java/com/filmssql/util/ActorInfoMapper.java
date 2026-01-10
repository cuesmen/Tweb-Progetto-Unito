package com.filmssql.util;
import com.filmssql.domain.entity.ActorInfo;
import com.filmssql.web.dto.ActorInfoDTO;

public final class ActorInfoMapper {
    private ActorInfoMapper() {}

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
