import type { TerrainDimensions, TerrainMask } from '../terrain/mask';

export interface ImpactResult {
  hit: boolean;
  x: number;
  y: number;
}

// Sample along the segment from (x0,y0) to (x1,y1) to find first solid pixel
export const segmentFirstImpact = (
  mask: TerrainMask,
  dims: TerrainDimensions,
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  sampleStep: number = 0.75,
): ImpactResult | null => {
  const dx = x1 - x0;
  const dy = y1 - y0;
  const length = Math.hypot(dx, dy);
  if (length === 0) return null;
  const steps = Math.max(1, Math.ceil(length / sampleStep));
  const stepx = dx / steps;
  const stepy = dy / steps;
  let px = x0;
  let py = y0;
  for (let i = 0; i <= steps; i += 1) {
    const ix = Math.round(px);
    const iy = Math.round(py);
    if (ix >= 0 && iy >= 0 && ix < dims.width && iy < dims.height) {
      const idx = iy * dims.width + ix;
      if (mask[idx] === 1) {
        return { hit: true, x: ix, y: iy };
      }
    }
    px += stepx;
    py += stepy;
  }
  return null;
};
