import { useEffect, useRef } from 'react';
import { startGameLoop } from './game/loop';
import './index.css';
import { generateHeightmap } from './game/terrain/generate-heightmap';
import type { TerrainConfig } from './game/terrain/types';
import { renderTerrainFromHeightmap, renderTerrainOutline } from './game/render/terrain';
import {
  createMaskFromHeightmap,
  applyCrater,
  recomputeHeightmapFromMask,
} from './game/terrain/mask';
import type { TerrainDimensions } from './game/terrain/mask';
import { placeTwoTanks } from './game/spawn/place-tanks';
import { renderTank } from './game/render/tank';
import {
  ANGLE_DEG_DEFAULT,
  LAUNCH_SPEED_DEFAULT,
  GRAVITY_PX_S2,
  DEFAULT_WIND_AX,
  EXPLOSION_RADIUS,
} from './game/config';
import { createProjectile, stepProjectile } from './game/physics/projectile';
import { segmentFirstImpact } from './game/physics/collision';
import { applyExplosion } from './game/effects/explosion';
import { Hud } from './ui/hud';
import { useReducer } from 'react';
import {
  ANGLE_DEG_DEFAULT,
  LAUNCH_SPEED_DEFAULT,
  GRAVITY_PX_S2,
  DEFAULT_WIND_AX,
  EXPLOSION_RADIUS,
} from './game/config';
import {
  createInitialGameState,
  reducer as gameReducer,
  selectActiveTank,
} from './game/state/game';
import { simulateShot } from './game/state/shot';
import { addShake, createShake, updateAndGetOffset } from './game/render/shake';

export const App = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [game, dispatch] = useReducer(
    gameReducer,
    createInitialGameState({
      tanks: [
        { id: 'A', position: { x: 100, y: 100 } },
        { id: 'B', position: { x: 300, y: 100 } },
      ],
      initialAngleDeg: ANGLE_DEG_DEFAULT,
      initialPower: LAUNCH_SPEED_DEFAULT,
      windAx: DEFAULT_WIND_AX,
    }),
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dims: TerrainDimensions = {
      width: Math.floor(window.innerWidth),
      height: Math.floor(window.innerHeight),
    };
    const config: TerrainConfig = {
      width: dims.width,
      minHeight: Math.floor(dims.height * 0.35),
      maxHeight: Math.floor(dims.height * 0.65),
      roughness: 0.55,
      smoothingPasses: 2,
      seed: 12345,
    };
    let heights = generateHeightmap(config);
    let mask = createMaskFromHeightmap(heights, dims);
    const shake = createShake();
    const [tankA, tankB] = placeTwoTanks({
      dims,
      mask,
      tankRadius: 10,
      minSeparation: Math.floor(dims.width * 0.35),
      maxSlopeDegrees: 30,
    });
    // Initialize positions into game state clones for rendering/controls
    dispatch({ type: 'setWind', windAx: DEFAULT_WIND_AX });

    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = Math.floor(e.clientX - rect.left);
      const y = Math.floor(e.clientY - rect.top);
      const radius = 30;
      mask = applyCrater(mask, dims, x, y, radius);
      heights = recomputeHeightmapFromMask(mask, dims);
    };
    canvas.addEventListener('click', handleClick);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === ' ') {
        const active = selectActiveTank(game);
        const fireFrom = active.id === 'A' ? tankA : tankB;
        const fireSim = simulateShot(
          {
            ...game,
            windAx: windAxRef.current,
          },
          { ...active, position: fireFrom },
          { mask, dims },
        );
        if (fireSim.impact) {
          mask = fireSim.mask;
          heights = fireSim.heights.length ? fireSim.heights : heights;
          addShake(shake, 3, 0.25);
        }
      }
    };
    window.addEventListener('keydown', onKey);

    const update = () => {
      // placeholder for physics updates
    };

    const render = (ctx: CanvasRenderingContext2D) => {
      const { width, height } = ctx.canvas;
      ctx.clearRect(0, 0, width, height);

      // simple background
      const grd = ctx.createLinearGradient(0, 0, 0, height);
      grd.addColorStop(0, '#0f172a');
      grd.addColorStop(1, '#1e293b');
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, width, height);

      const offset = updateAndGetOffset(shake, 1 / 60);
      ctx.save();
      ctx.translate(offset.x, offset.y);

      // centered text
      ctx.fillStyle = '#cbd5e1';
      ctx.font = '16px system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Artillery Game — Bootstrapped', width / 2, height / 2);

      // terrain
      renderTerrainFromHeightmap(ctx, heights, width, height);
      renderTerrainOutline(ctx, heights);

      // tanks
      renderTank(ctx, tankA, 10, '#38bdf8');
      renderTank(ctx, tankB, 10, '#f472b6');
      ctx.restore();
    };

    const loop = startGameLoop(canvas, update, render);
    return () => {
      loop.stop();
      canvas.removeEventListener('click', handleClick);
      window.removeEventListener('keydown', onKey);
    };
  }, []);

  const angleRef = useRef<number>(ANGLE_DEG_DEFAULT);
  const powerRef = useRef<number>(LAUNCH_SPEED_DEFAULT);
  const windAxRef = useRef<number>(DEFAULT_WIND_AX);

  const handleAngleChange = (deg: number) => {
    angleRef.current = deg;
    dispatch({ type: 'setAngle', degrees: deg });
  };
  const handlePowerChange = (p: number) => {
    powerRef.current = p;
    dispatch({ type: 'setPower', power: p });
  };
  const handleWindChange = (ax: number) => {
    windAxRef.current = ax;
    dispatch({ type: 'setWind', windAx: ax });
  };

  // second effect was merged into the main effect below to access local terrain state

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <canvas ref={canvasRef} />
      <Hud
        angleDeg={angleRef.current}
        power={powerRef.current}
        windAx={windAxRef.current}
        onAngleChange={handleAngleChange}
        onPowerChange={handlePowerChange}
        onWindChange={handleWindChange}
        activeTankId={selectActiveTank(game).id}
      />
    </div>
  );
};
