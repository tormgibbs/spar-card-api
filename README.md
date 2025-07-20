# Spar Card Game API – Multiplayer Trick Card Game with AI Bots

Spar Game is a multiplayer, turn-based card game featuring AI opponents with dynamic play styles. It's built as a distributed system using:

- A **Python gRPC server** running a custom AI (`SparBot`)
- A **Node.js + TypeScript Express server** handling users, game rooms, and sockets
- **Redis** for distributed room storage and pub/sub
- **WebSockets** for real-time updates
- **Docker** for full-service orchestration

---

## Quick Start

### 1. Clone the Repo

```bash
git clone https://github.com/tormgibbs/spar-card-api
cd spar-card-api
````

### 2. Start the App with Docker

```bash
docker-compose up --build
```

- Game client API → `http://localhost:3000`
    
- AI Bot gRPC server → `localhost:50051`
    
- Redis → `localhost:6379`
    

---

## Architecture Overview

- Game rooms and turns are managed in Redis
    
- WebSockets broadcast game state to all clients in a room
    
- Bot decisions are fetched over gRPC from a separate service
    

---

## API Overview

### REST Endpoints (Express)

|Method|Endpoint|Description|
|---|---|---|
|POST|`/rooms`|Create a game room|
|POST|`/rooms/:id/join`|Join a room|
|GET|`/rooms/:id`|Get room state|
|POST|`/rooms/:id/start`|Start the game (creator only)|
|POST|`/rooms/:id/play`|Play a card|

### WebSocket Events

- `joinRoom(roomId)` – Join socket room
    
- `playerJoined` – Player joined notification
    
- `gameStarted` – Game is live
    
- `cardPlayed` – A card has been played
    
- `nextTurn` – Whose turn is it
    
- `trickCompleted` – Trick ended
    

### gRPC Methods (Bot AI)

Defined in `game.proto`:

|RPC Method|Purpose|
|---|---|
|`CreateBot`|Creates a new bot|
|`StartGame`|Sends hand to bot|
|`PlayCard`|Plays a card based on current trick|
|`GetBotDecision`|Suggests a card without state change|
|`ResetBot`|Clears bot state|
|`GetBotHand`|Retrieves current bot hand|

---

## About the Bot (SparBot)

The AI opponent is designed with a configurable **aggression parameter (0.0–1.0)**. Key features:

- Plays strategically to win later tricks
    
- Follows suit when possible
    
- Remembers seen cards
    
- Balances risk vs. reward based on aggression
    

> Example:
> 
> - `aggression=0.2` → very conservative
>     
> - `aggression=0.8` → aggressively attempts to win early
>     



---

## Features

✅ Multiplayer support (up to 5 players)  
✅ Real-time play using WebSockets  
✅ AI bot with tunable behavior  
✅ Redis pub/sub for distributed updates  
✅ Pluggable room store (memory or Redis)  
✅ Full Docker orchestration  
✅ Type-safe schemas with Zod

---

## TODO / Improvements

-  Add game-over condition
    
-  Frontend game UI (React or similar)
    
-  Spectator mode
    
-  Auth/session support
    
-  Bot difficulty levels / learning
    