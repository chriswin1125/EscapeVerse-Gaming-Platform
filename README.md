# 🕹️ EscapeVerse – Real-Time Multiplayer Escape Room Platform

[![Stack](https://img.shields.io/badge/Stack-MERN%20+%20Socket.IO-cyan.svg)](#technology-stack)
[![Style](https://img.shields.io/badge/Design-Cyberpunk%20%2F%20AAA%20Gaming-purple.svg)](#design--user-experience)
[![License](https://img.shields.io/badge/License-MIT-emerald.svg)](#)

**EscapeVerse** is a production-quality, highly interactive multiplayer escape room platform. Teams of 2 to 6 operatives link up in synchronized virtual escape chambers, scour 2.5D visual environments for cryptic intel, crack ciphers, calibrate analog valves, sever circuit breaker wires, and escape before the countdown timer hits zero.

---

## 🌟 Key Features

### 1. ⚡ Real-Time Multiplayer Engine (Socket.IO)
- **Room Lounge & Invitation Codes**: Generate unique 6-character room codes (`e.g. 7X9K2P`), copy with one click, and share with teammates.
- **Synchronized Room State**: All players see identical synchronized countdown timers, stage progressions, unlocked hotspots, and team scores.
- **Server-Side Verification**: Answer checking, hint deductions, and incorrect attempt penalties are calculated strictly server-side.
- **Tactical Team Radio**: In-game multiplayer tactical radio chat featuring quick-ping buttons (*"Found a clue!"*, *"Need backup!"*, *"Watch the clock!"*).
- **Graceful Reconnections**: Handled player reconnects and real-time active status indicators.

### 2. 🧩 Interactive Procedural Puzzle Engine
EscapeVerse features tactile, custom-built puzzle components rather than static quizzes:
- **Rotary Caesar / Vigenère Cipher Decoder**: Interactive shift frequency dials with real-time decryption previews.
- **High-Voltage Circuit Defusal (Wire Cutting)**: Sparking circuit breaker panel with color-coded cables (Power, Ground, Data, Logic) and cut sequence logic.
- **Holographic Neural Pattern Matrix**: 4x4 interactive cyber grid with illuminated nodes and pathway tracing.
- **Tactile Keypad / Biometric Lock**: Backlit LCD display with tactile audio clicks and digit validation.
- **Analog Slider Calibration**: Multi-channel pressure sliders with live gauges and tolerance zone alignment.
- **Chemical Lab Titration Centrifuge**: Realistic fluid mixing with colored reagents and dynamic fluid fill levels.
- **Cursed Glyph Memory Match**: Shuffled 3D flipping card cards with matching occult sigils.

### 3. 🔊 Zero-Dependency Web Audio Synthesizer
Built-in procedural audio engine using the browser's native **HTML5 Web Audio API**:
- High-tech interface clicks and button blips
- Ticking countdown heartbeat warning
- Triumphant harmonic victory fanfare
- Low-frequency security alert error buzzer
- Optional looping deep ambient sci-fi synthesizer soundtrack
- Master mute and volume slider controls

---

## 🏰 Initial Escape Chambers

| Chamber | Theme | Security Sectors | Default Timer (Medium) |
|---|---|---|---|
| **Haunted Mansion: The Cursed Ancestry** | Gothic Horror | Whispering Foyer → Ancestral Gallery → Catacomb Crypt | 20 Minutes |
| **Secret Laboratory: Biohazard Protocol** | Sci-Fi / Bio | Decon Chamber → Cryogenic Core → Quarantine Blast Door | 20 Minutes |
| **Cyber Prison: System Override** | Cyberpunk AI | Plasma Cell Block C → Neural AI Core → Orbital Hangar | 20 Minutes |
| **Ancient Temple: Pharaoh’s Tomb** | Ancient Egypt | Hall of Hieroglyphs → Sun Mirror Sanctuary → Golden Sarcophagus | 20 Minutes |
| **Bank Heist: The Federal Vault** | Tactical Heist | Sub-Basement Corridor → Alarm Control Box → 20-Ton Vault Door | 20 Minutes |

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js** v18+ (tested on v22.17)
- **MongoDB** running locally on port `27017` (or MongoDB Atlas connection string)

### 1. Installation
Clone the repository and install all dependencies:
```bash
# Install root, server, and client dependencies
npm run install:all
```

### 2. Database Seeding
Seed all 5 Escape Rooms, 15 interactive puzzles, achievements, and preconfigured accounts:
```bash
npm run seed
```

### 3. Launch the Application
Run both the Express/Socket.IO backend server and Vite client concurrently:
```bash
npm run dev
```

- **Frontend Client**: [http://localhost:5173](http://localhost:5173)
- **Backend API & WebSockets**: [http://localhost:5000](http://localhost:5000)

---

## 🔑 Pre-Configured Demo Credentials

Use these accounts for instant testing, or enlist a new operative from the registration page:

| Role | Email | Password | Access Level |
|---|---|---|---|
| **Admin Superuser** | `admin@escapeverse.com` | `AdminPass123!` | Full Admin CMS & Platform Control |
| **Veteran Player 1** | `player1@escapeverse.com` | `PlayerPass123!` | Level 5 Master Cryptographer |
| **Veteran Player 2** | `player2@escapeverse.com` | `PlayerPass123!` | Level 3 Adept Sleuth |
| **Detective Fox** | `detective@escapeverse.com` | `PlayerPass123!` | Level 4 Elite Infiltrator |

*(Note: The login page also includes 1-click autofill buttons for these credentials).*

---

## 🛠️ Technology Stack

### Frontend
- **React.js 18** with **Vite**
- **Tailwind CSS** with custom dark cyberpunk theme
- **Framer Motion** for animations and 3D card flips
- **Socket.IO Client** for real-time multiplayer sync
- **Lucide React** icons
- **React Hot Toast** for notifications
- **Canvas Confetti** for cinematic victory celebration
- **Web Audio API** for procedural sound effects and ambient soundtrack

### Backend
- **Node.js** & **Express.js**
- **MongoDB** with **Mongoose**
- **Socket.IO** server engine
- **JWT (JSON Web Tokens)** for stateless authentication
- **bcryptjs** for password encryption
- **Morgan** HTTP request logger

---

## 📂 Project Architecture

```
EscapeVerse/
├── package.json              # Monorepo concurrent startup scripts
├── server/
│   ├── src/
│   │   ├── config/           # MongoDB connection configuration
│   │   ├── controllers/      # Auth, Room, Session, Admin, Leaderboard, User
│   │   ├── middleware/       # JWT protection, Admin role check, Error handler
│   │   ├── models/           # User, Room, Puzzle, GameSession, Achievement, Leaderboard
│   │   ├── routes/           # REST API Route definitions
│   │   ├── services/         # Game engine (answer validation, achievements, scoring)
│   │   ├── socket/           # Real-time socket handlers (timer, chat, puzzle, sync)
│   │   ├── utils/            # Database seed script with 5 rooms & 15 puzzles
│   │   └── server.js         # Express + Socket.IO entry point
│   ├── .env.example
│   └── package.json
└── client/
    ├── src/
    │   ├── components/
    │   │   ├── common/       # Navbar, Footer, JoinModal
    │   │   ├── game/         # GameHeader, RoomEnvironment, ClueInventory, TeamChat, PuzzleModal, Victory, Defeat
    │   │   └── puzzles/      # Cipher, WireCut, PatternGrid, Keypad, Slider, ChemicalLab, MemoryMatch
    │   ├── context/          # AuthContext, SocketContext, AudioContext
    │   ├── pages/            # Home, Dashboard, RoomBrowser, RoomDetails, GameSession, Leaderboard, Profile, Admin, Login, Register
    │   ├── services/         # API and Socket client services
    │   ├── utils/            # Web Audio synthesizer SFX
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── tailwind.config.js
    ├── vite.config.js
    └── package.json
```

---

## 🎮 Multiplayer Gameplay Walkthrough

1. **Enlist or Log In**: Authenticate using demo credentials or create a new operative callsign.
2. **Select an Operation**: Browse the 5 escape chambers, read the mission briefing, and choose your difficulty (Easy: 30m, Medium: 20m, Hard: 15m).
3. **Multiplayer Lounge**: The host initializes the room to generate a unique 6-character room code. Teammates join by entering the code in the top navigation bar or dashboard.
4. **Initiate Mission**: Once teammates toggle **READY**, the host engages the countdown sequence.
5. **Sector Search**: Click pulsing hotspots in the 2.5D visual environment to gather blueprints, formulas, and secret notes into the team dossier.
6. **Solve Puzzles**: Coordinate over team radio to crack ciphers, cut high-voltage wires, calibrate cooling valves, and bypass security locks.
7. **Bypass Containment**: Complete all stage objectives to trigger the cinematic escape victory sequence, earn XP, unlock achievement badges, and claim your spot on the global leaderboard!
