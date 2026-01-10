package com.filmssql.domain.repository;

import com.filmssql.domain.entity.ActorInfo;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ActorInfoRepository extends JpaRepository<ActorInfo, Long>
{
}
