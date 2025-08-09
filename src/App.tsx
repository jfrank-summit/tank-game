import { useEffect, useRef } from 'react'
import { startGameLoop } from './game/loop'
import './index.css'
import { generateHeightmap } from './game/terrain/generate-heightmap'
import type { TerrainConfig } from './game/terrain/types'
import { renderTerrainFromHeightmap, renderTerrainOutline } from './game/render/terrain'
import {
  createMaskFromHeightmap,
  applyCrater,
  recomputeHeightmapFromMask,
} from './game/terrain/mask'
import type { TerrainDimensions } from './game/terrain/mask'
import { placeTwoTanks } from './game/spawn/place-tanks'
import { renderTank } from './game/render/tank'

export const App = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dims: TerrainDimensions = {
      width: Math.floor(window.innerWidth),
      height: Math.floor(window.innerHeight),
    }
    const config: TerrainConfig = {
      width: dims.width,
      minHeight: Math.floor(dims.height * 0.35),
      maxHeight: Math.floor(dims.height * 0.65),
      roughness: 0.55,
      smoothingPasses: 2,
      seed: 12345,
    }
    let heights = generateHeightmap(config)
    let mask = createMaskFromHeightmap(heights, dims)
    const [tankA, tankB] = placeTwoTanks({
      dims,
      mask,
      tankRadius: 10,
      minSeparation: Math.floor(dims.width * 0.35),
      maxSlopeDegrees: 30,
    })

    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const x = Math.floor(e.clientX - rect.left)
      const y = Math.floor(e.clientY - rect.top)
      const radius = 30
      mask = applyCrater(mask, dims, x, y, radius)
      heights = recomputeHeightmapFromMask(mask, dims)
    }
    canvas.addEventListener('click', handleClick)

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

      // centered text
      ctx.fillStyle = '#cbd5e1';
      ctx.font = '16px system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Artillery Game — Bootstrapped', width / 2, height / 2);

      // terrain
      renderTerrainFromHeightmap(ctx, heights, width, height)
      renderTerrainOutline(ctx, heights)

      // tanks
      renderTank(ctx, tankA, 10, '#38bdf8')
      renderTank(ctx, tankB, 10, '#f472b6')
    };

    const loop = startGameLoop(canvas, update, render);
    return () => {
      loop.stop()
      canvas.removeEventListener('click', handleClick)
    }
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <canvas ref={canvasRef} />
    </div>
  )
}
