# MainServerExpress

Express/Socket.IO gateway for MoviePoint App. It proxies API calls to the Spring backend (`SPRING_URL`), serves OpenAPI docs, and handles chat persistence on MongoDB.

## Requirements
- Node.js 18+ and npm
- MongoDB reachable at `MONGO_URI` (default `mongodb://127.0.0.1:27017`)
- Spring backend running (default `http://localhost:8081`) exposing movie/actor APIs

## Quick start
1. Install dependencies: `npm install`
2. Create a `.env` (see variables below) or rely on defaults.
3. Run:
   - development: `npm run dev` (nodemon)
   - production: `npm start`
4. OpenAPI docs available at `http://localhost:4000/docs` (or your port) when `ENABLE_DOCS=true`.

### Environment variables (.env)
```
PORT=4000                        # Gateway port
SPA_ORIGIN=http://localhost:5173 # CORS origin for the SPA
SPRING_URL=http://localhost:8081 # Upstream Spring backend
ENABLE_DOCS=true                 # Serve /docs and /openapi.json
IMG_BASE_URL=                    # Base URL for images (fallback: SPRING_URL + '/')

# MongoDB chat
MONGO_URI=mongodb://127.0.0.1:27017
MONGO_DB=appdb
MONGO_MAX_RETRIES=5
MONGO_MIN_POOL_SIZE=0
MONGO_MAX_POOL_SIZE=20
```

## Architecture at a glance
- **Express 5 + Axios**: proxies to Spring for `Movies`, `Actors`, `Reviews`, `OscarAwards`, and `Search`.
- **CORS** enforced on `SPA_ORIGIN`; JSON parsing enabled on all `/api` routes.
- **Swagger/OpenAPI** generated from JSDoc annotations in `src/routes` and served under `/docs`.
- **Socket.IO**: websocket transport for chat rooms (`global` or `movie:<id>`) and broadcasts on new messages.
- **MongoDB**: bootstraps `chats` and `messages` collections with indexes; health-check exposed at `/api/chat/health`.
- **In-memory cache** (NodeCache) for searches; TTL 60s.
- **Images**: `buildImageUrl` helper composes image links using `IMG_BASE_URL`.

## Project structure
```
src/
  config/        # Env handling and Swagger setup
  routes/        # REST endpoints (movies, actors, search, reviews, oscar, chat)
  services/      # Spring client and cache
  mongodb/       # Mongo connection, health, and collection bootstrap
  utils/         # Image, gender, and request helpers
  server.js      # Express/Socket.IO bootstrap and error handling
```

## Key endpoints
- `GET /api/ping` – gateway health.
- Movies: `GET /api/movies/:id`, `/movies/random`, `/movies/top-rated`, `/movies/latest`.
- Actors: `GET /api/actors/:actorId/info`.
- Reviews: `GET /api/reviewmovie/:id`.
- Oscar: `GET /api/oscaraward/actor/:actor_id`, `/oscaraward/movie/:movie_id`.
- Search: `GET /api/search?query=<text>` (movie/actor results, cached 60s).
- Chat (Mongo):
  - `POST /api/chat/global/messages`, `GET /api/chat/global/messages`
  - `POST /api/chat/movie/:movieId/messages`, `GET /api/chat/movie/:movieId/messages`
  - `GET /api/chat/movie/:movieId` metadata; `GET /api/chat/health` Mongo/collection status.

## Socket.IO events
- Client emits `chat:join` with `global` or `movie:<movieId>`; receives `chat:joined`.
- `chat:leave` leaves a room; receives `chat:left`.
- Messages saved via REST are broadcast as `chat:message` to the relevant room.

## npm scripts
- `npm run dev` – start with hot reload (nodemon).
- `npm start` – start for production.
- `npm run docs` – generate JSDoc (output configured via `jsdoc.json`).

## Operational notes
- Start Mongo before the gateway; the code auto-creates collections/indexes and the global chat.
- Spring proxy preserves query/path params; upstream errors are surfaced via the error middleware with `{ ok, data, error }`.
