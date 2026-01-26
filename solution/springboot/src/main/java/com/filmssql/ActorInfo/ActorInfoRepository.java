package com.filmssql.ActorInfo;

import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Repository for {@link ActorInfo}.
 */
public interface ActorInfoRepository extends JpaRepository<ActorInfo, Long>
{
}
