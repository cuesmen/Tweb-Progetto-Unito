# MiddleServerExpress

Middle-tier server for MoviePoint. Provides Mongo-backed movie reviews over REST and manages chat persistence/broadcast over Socket.IO. The main gateway connects here for `/api/reviewmovie` and for chat events.

## Requirements
- Node.js 18+ and npm
- MongoDB reachable at `MONGO_URI` (default `mongodb://127.0.0.1:27017`)
- Gateway consuming this service (default assumes `http://localhost:4000` allowed via CORS)

## Quick start
1. Install dependencies: `npm install`
2. Create a `.env` (see variables below) or rely on defaults
3. Run
   - development: `npm run dev` (nodemon)
   - production: `npm start`
4. OpenAPI docs at `http://localhost:4001/docs` (or your port) when `ENABLE_DOCS=true`

### Environment variables (.env)
```
PORT=4001                         # Service port (match gateway MIDDLE_URL/MIDDLE_SOCKET_URL)
SERVER_ORIGIN=http://localhost:4000  # CORS origin for HTTP (gateway)
ENABLE_DOCS=true                  # Serve /docs and /openapi.json

# MongoDB
MONGO_URI=mongodb://127.0.0.1:27017
MONGO_DB=moviepoint
```

## Architecture at a glance
- **Express 5** REST API exposing Mongo-stored movie reviews.
- **Socket.IO** server handling chat rooms (`global` or `movie:<id>`), saving messages in MongoDB, and broadcasting to room subscribers.
- **Mongoose** models for chats, messages, and reviews; ensures the global chat document exists on startup.
- **Swagger/OpenAPI** generated from JSDoc (`src/routes`) and served under `/docs` + `/openapi.json`.
- **CORS** restricted to `SERVER_ORIGIN`; JSON parsing enabled on `/api` routes.

## Project structure
```
app.js          # Express app + routes + Swagger toggle
bin/www         # HTTP + Socket.IO bootstrap + Mongo connection
src/
  config/       # Env handling and Swagger setup
  controllers/  # Chat + review business logic
  database/     # Mongoose connection helpers
  models/       # Mongoose schemas (chat, chatMessage, review)
  routes/       # REST endpoints (reviews)
  socket-io/    # Socket.IO chat handlers
```

## HTTP endpoints
- `GET /api/reviewmovie/:movieId` – returns stored reviews for the given movie (404 if none).
- `GET /docs`, `GET /openapi.json` – Swagger UI/schema (when enabled).

## Socket.IO events
- `chat:join` / `chat:leave` with `global` or `movie:<movieId>` — join/leave rooms.
- `chat:message` — validates and stores the message, then broadcasts to the room (ack returns saved payload or error).
- `chat:list` — paginated history with cursor support (ack returns `{ items, hasMore, nextCursor }`).

## Operational notes
- Start MongoDB before launching; connection is established on server start and the global chat is upserted.
- Configure `PORT` to the value referenced by the gateway (`MIDDLE_URL`/`MIDDLE_SOCKET_URL`).
- Logs are verbose in dev mode (`morgan` + simple request logger);s