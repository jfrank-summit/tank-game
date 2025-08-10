# Artillery Game (browser)

Minimal dev slice:

- Yarn + Vite + React + TS
- Canvas render with destructible terrain
- Two tanks spawn; press Space to fire
- Wind/angle/power controls in HUD

Getting started

1) Install deps
   ```sh
   yarn
   ```
2) Start dev server (defaults to port 4173)
   ```sh
   yarn dev
   ```
3) Open http://localhost:4173

Controls

- Click terrain to make a debug crater
- HUD sliders: Angle, Power, Wind
- Space: fire from left tank

Tech stack

- TypeScript (strict), React (functional + hooks), Vite, ESLint/Prettier, Vitest

Notes

- Terrain is seeded at load (see `src/App.tsx`)
- Explosions deform terrain and cause screen shake
