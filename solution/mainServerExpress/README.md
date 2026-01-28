# MainServerExpress

Express/Socket.IO gateway for MoviePoint. It fronts the SPA, proxies catalog APIs to the Spring backend, forwards reviews/chat to the middle server, and serves Swagger docs.

## Requirements
- Node.js 18+ and npm
- Spring backend running (default `http://localhost:8081`) for movies/actors/search/oscar
- Middle Express server running (default `http://localhost:4001`, Socket.IO on same host) for reviews + chat
- SPA origin configured for CORS (default `http://localhost:5173`)

## Quick start
1. Install dependencies: `npm install`
2. Create a `.env` (see variables below) or rely on defaults
3. Run
   - development: `npm run dev` (nodemon)
   - production: `npm start`
4. OpenAPI docs at `http://localhost:4000/docs` when `ENABLE_DOCS=true`

### Environment variables (.env)
```
PORT=4000                         # Gateway port
SPA_ORIGIN=http://localhost:5173  # CORS origin for the SPA
SPRING_URL=http://localhost:8081  # Upstream Spring backend
ENABLE_DOCS=true                  # Serve /docs and /openapi.json
IMG_BASE_URL=                     # Optional override for images (fallback: SPRING_URL + '/')

# Middle layer (reviews + chat persistence)
MIDDLE_URL=http://localhost:4001          # HTTP endpoint (used by /api/reviewmovie)
MIDDLE_SOCKET_URL=http://localhost:4001   # Socket.IO endpoint (chat forwarding)
```

## Architecture at a glance
- **Express 5** gateway with Axios clients:
  - Proxies catalog APIs to the Spring backend (`SPRING_URL`).
  - Proxies movie reviews to the middle server (`MIDDLE_URL`).
- **Socket.IO bridge**: accepts SPA sockets, forwards chat events to the middle Socket.IO server, and re-broadcasts messages to rooms (`global` or `movie:<id>`).
- **Swagger/OpenAPI** generated from JSDoc (`src/routes`) and exposed at `/docs` + `/openapi.json` when enabled.
- **In-memory cache** (NodeCache) for search results (TTL 60s).
- **Images**: `buildImageUrl` composes fully qualified poster links using `IMG_BASE_URL` fallback.

## Project structure
```
app.js            # Express app + routes + Swagger toggle
bin/www.js        # HTTP + Socket.IO bootstrap
src/
  config/        # Env handling and Swagger setup
  routes/        # REST endpoints (movies, actors, search, reviews, oscar, system)
  services/      # Axios clients (Spring + middle) and cache
  socket-io/     # Socket.IO chat bridge to the middle server
  utils/         # Image, gender, and request helpers
```

## Key endpoints
- `GET /api/ping` – gateway health.
- Movies (Spring): `GET /api/movies/:id`, `/movies/random`, `/movies/top-rated`, `/movies/latest`.
- Actors (Spring): `GET /api/actors/:actorId/info`.
- Reviews (middle): `GET /api/reviewmovie/:id`.
- Oscar (Spring): `GET /api/oscaraward/actor/:actor_id`, `/oscaraward/movie/:movie_id`.
- Search (Spring): `GET /api/search?query=<text>` (cached 60s).

## Socket.IO events
- Client connects here; gateway forwards to middle Socket.IO.
- `chat:join` / `chat:leave` with `global` or `movie:<movieId>` — joins/leaves both gateway and middle rooms.
- `chat:message` — forwarded to middle; response ack is relayed.
- `chat:list` — forwarded to middle for paginated history.
- Gateway re-emits `chat:message` events coming from the middle server to subscribed rooms.

## npm scripts
- `npm run dev` – start with hot reload (nodemon).
- `npm start` – start for production.
- `npm run docs` – generate JSDoc (output configured via `jsdoc.json`).

## Notes
- Start the Spring backend and the middle server before the gateway; chat and reviews depend on the middle layer.
- Spring proxy preserves query/path params; upstream errors propagate via the error middleware with `{ ok, data, error }`.
