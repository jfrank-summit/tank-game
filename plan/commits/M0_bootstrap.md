## M0 — Bootstrap (Day 0-1) Commit Breakdown

Goal: Project scaffold with Yarn, Vite, React + TypeScript (strict), ESLint/Prettier, and a Canvas render loop with fixed timestep + interpolation.

### Commit 1: chore(init): initialize repo and Yarn

- Create repo, add `.gitignore` (node, dist, coverage, .DS_Store).
- Initialize Yarn and set node version policy if using Volta/asdf.

Commands

```sh
yarn init -y
echo node_modules/ > .gitignore
echo dist/ >> .gitignore
echo coverage/ >> .gitignore
echo .DS_Store >> .gitignore
```

### Commit 2: build: scaffold Vite + React + TypeScript

- Create Vite app with React + TS template.
- Ensure TypeScript is strict.

Commands

```sh
yarn create vite . --template react-ts --yes
yarn
```

Edits

- `tsconfig.json`: enable strict, noUncheckedIndexedAccess, noImplicitOverride, noFallthroughCasesInSwitch.
- `index.html`: set title, include a full-viewport root.

### Commit 3: chore(lint): add ESLint + Prettier

- Add ESLint with typescript-eslint and Prettier integration.
- Add lint scripts.

Commands

```sh
yarn add -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin prettier eslint-config-prettier eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-import
```

Edits

- `.eslintrc.cjs`: TS + React rules, import ordering; prefer arrow functions; no classes in `src/game/**`.
- `.prettierrc`: printWidth 100, semi true, singleQuote false, trailingComma all.
- `package.json` scripts: "lint", "lint:fix", "typecheck".

### Commit 4: feat(loop): add Canvas render loop (fixed timestep)

- Add a dedicated game loop module with fixed update step (dt = 1/60) and interpolation ratio `alpha`.
- Use `requestAnimationFrame`. Accumulate elapsed time; clamp to avoid spiral of death.
- Render clears canvas and draws a simple background + debug text.

Suggested files

- `src/game/loop.ts`: startGameLoop(canvas, update, render)
- `src/game/time.ts`: constants and helpers for dt and clamping
- `src/main.tsx`: wire up Canvas and start loop
- `src/App.tsx`: mount a `<canvas>` with full-viewport sizing

Acceptance

- Dev server starts; a canvas fills the window.
- Loop runs at ~60 FPS, with stable updates when tab is throttled (thanks to accumulator clamping).
- Simple debug text shows FPS and `alpha`.

### Commit 5: chore(scripts): add dev/build/test scaffolding

- Add scripts: "dev", "build", "preview", "test", "test:watch".
- Install Vitest and RTL for later.

Commands

```sh
yarn add -D vitest jsdom @testing-library/react @testing-library/user-event @testing-library/jest-dom @types/jest @types/node
```

### Commit 6: docs: add README sections for running and conventions

- Update `README.md` with run commands and coding conventions (arrow functions, immutability, avoid classes).

### Verification checklist

- `yarn dev` serves at localhost with a responsive canvas.
- Resizing window adjusts canvas correctly; no blurry scaling (set devicePixelRatio).
- ESLint runs cleanly; TypeScript build passes.

### Nice-to-have (optional in M0)

- GitHub Actions workflow for `lint` and `build` on PRs.
- Basic theming for menus (to be added later).
