# MoviePoint Frontend
A Vite + React single-page app for exploring movies and actors, chatting with other cinephiles, and browsing curated carousels. The UI is built around a glassmorphism theme and powered by a backend API (see environment variables below).

## Features
- Global search in the navbar with debounced queries for movies and actors.
- Home page with a shuffleable featured movie plus latest and top-rated carousels.
- Film detail page with synopsis, cast/crew carousels, user reviews, Oscar awards, and a live room chat per movie.
- Actor page with biography, stats, filmography cards, and award highlights.
- Global chat room using Socket.IO to talk with other visitors.
- Reusable components (alerts, loaders, cards, chips) and JSDoc-generated API documentation.

## Tech Stack
- React 19 + Vite 7, React Router, React Icons.
- Axios for REST calls, Socket.IO client for realtime chat.
- ESLint for linting; JSDoc (better-docs theme) for API docs.

## Project Structure
- `src/main`: App entry point, global providers, CSS imports.
- `src/navigation`: Router setup, navbar with search, footer.
- `src/pages`: Screen components (`home`, `film`, `actor`, `globalchat`).
- `src/api`: Axios client, React query-like hooks, and service wrappers.
- `src/components`: Shared UI (alerts, chat, carousels, loaders, back-to-top).
- `public` / `src/assets`: Static assets, icons, and images.
- `docs`: Generated JSDoc site for services, hooks, and models.

## Requirements
- Node.js 18+ and npm.
- Backend API reachable at `VITE_API_BASE_URL` (defaults to `http://localhost:4000/api`).
- Socket.IO server for chat (defaults to `http://localhost:4000` in `Chat` props).

## Setup
1) Install dependencies:
```
npm install
```
2) Create a `.env` (optional) to point to your backend:
```
VITE_API_BASE_URL=http://localhost:4000/api
```
3) Start the dev server:
```
npm run dev
```
4) Build for production:
```
npm run build
```
5) Preview the production build locally:
```
npm run preview
```

## Quality & Docs
- Lint the project: `npm run lint`
- Regenerate API docs into `docs/`: `npm run docs`

## Notes
- The app relies on the backend for search, movie/actor data, reviews, Oscars, and chat history; ensure the API is running before testing the UI.
- Chat uses Socket.IO with room-based channels; the global room is exposed at `/global-chat`, while each movie chat is scoped by movie ID.
