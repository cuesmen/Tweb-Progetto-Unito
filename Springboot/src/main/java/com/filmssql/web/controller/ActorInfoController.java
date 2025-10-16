package com.filmssql.web.controller;

import com.filmssql.domain.entity.ActorInfo;
import com.filmssql.domain.repository.ActorInfoRepository;
import com.filmssql.util.ActorInfoMapper;
import com.filmssql.web.dto.ActorInfoDTO;
import com.filmssql.web.exception.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ActorInfoController {

    private final ActorInfoRepository infoRepo;

    // GET single: /api/actors/{actorId}/info
    @GetMapping("/actors/{actorId}/info")
    public ActorInfoDTO getByActor(@PathVariable Long actorId) {
        ActorInfo info = infoRepo.findById(actorId)
                .orElseThrow(() -> new NotFoundException("ActorInfo non trovato per actorId=" + actorId));
        return ActorInfoMapper.toDto(info);
    }

    // GET list paginated: /api/actor-infos?page=0&size=20
    @GetMapping("/actor-infos")
    public Page<ActorInfoDTO> list(@RequestParam(defaultValue = "0") int page,
                                   @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("actorId").ascending());
        return infoRepo.findAll(pageable).map(ActorInfoMapper::toDto);
    }
}

