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
import { addShake, createShake, updateAndGetOffset } from './game/render/shake';

export const App = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

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
        const startX = tankA.x;
        const startY = tankA.y;
        const angleRad = (angleRef.current * Math.PI) / 180;
        let prev = createProjectile(startX, startY, powerRef.current, angleRad);
        let current = prev;
        const dt = 1 / 120;
        let impact: ReturnType<typeof segmentFirstImpact> | null = null;
        for (let i = 0; i < 2000; i += 1) {
          current = stepProjectile(current, dt, {
            gravity: GRAVITY_PX_S2,
            windAx: windAxRef.current,
          });
          impact = segmentFirstImpact(mask, dims, prev.x, prev.y, current.x, current.y, 0.75);
          if (impact || current.x < 0 || current.x >= dims.width || current.y >= dims.height) {
            break;
          }
          prev = current;
        }
        if (impact) {
          const res = applyExplosion(mask, dims, impact.x, impact.y, EXPLOSION_RADIUS);
          mask = res.mask;
          heights = res.heights;
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
  };
  const handlePowerChange = (p: number) => {
    powerRef.current = p;
  };
  const handleWindChange = (ax: number) => {
    windAxRef.current = ax;
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
      />
    </div>
  );
};
