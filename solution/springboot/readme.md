# Spring Boot Backend – MoviePoint

This module provides the Spring Boot backend for MoviePoint. It exposes REST APIs for movies, actors, Oscars, reviews, and search, backed by PostgreSQL.

## Stack
- Java 17, Spring Boot
- Spring Web, Spring Data JPA (HikariCP, PostgreSQL)
- OpenAPI/Swagger (springdoc)

## Structure
- `src/main/java/com/filmssql/web/exception`: Custom exceptions (e.g., NotFoundException) with a global exception handler.
- `docs/`: generated API docs (Swagger UI at `/docs` when enabled).
- `src/main/resources/application.properties`: DB config, dialect, Swagger paths, static resources (images).

## Running
```bash
# from stack/springboot
./mvnw spring-boot:run
```
Default configuration targets PostgreSQL at `jdbc:postgresql://localhost:5432/unitoDB` with user `postgres`/`scanteq` (adjust in `application.properties` or env vars).

Swagger UI (if enabled): `http://localhost:8081/docs`

## APIs (high level)
- Movies: details, preview, top-rated, latest, random.
- Actors: details/info, previews.
- Reviews: CRUD/retrieve.
- Oscars: awards by category/year.
- Search: similarity-based search with pagination.

## Notes
- Uses DTO mapping to avoid lazy-loading issues and to keep responses lightweight.
- Custom queries for previews and top/latest sorted results.
- HikariCP pooling configured via Spring Boot defaults; additional tuning can be set in `application.properties`.
- Images served from a configurable base path (`app.images.dir`, exposed via static resources).
