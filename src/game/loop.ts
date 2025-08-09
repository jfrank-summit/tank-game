import { FIXED_DT_SECONDS, MAX_ACCUMULATED_SECONDS, nowSeconds, clamp } from './time';

export type UpdateFn = (dt: number) => void;
export type RenderFn = (ctx: CanvasRenderingContext2D, alpha: number) => void;

export interface GameLoopHandle {
  stop: () => void;
}

export const startGameLoop = (
  canvas: HTMLCanvasElement,
  update: UpdateFn,
  render: RenderFn,
): GameLoopHandle => {
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context not available');

  let running = true;
  let lastTime = nowSeconds();
  let accumulator = 0;

  const resize = () => {
    const dpr = Math.max(1, Math.floor(window.devicePixelRatio || 1));
    const width = window.innerWidth;
    const height = window.innerHeight;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  resize();
  window.addEventListener('resize', resize);

  const frame = () => {
    if (!running) return;
    const current = nowSeconds();
    let frameTime = current - lastTime;
    lastTime = current;

    // Avoid spiral of death under tab throttling
    frameTime = clamp(frameTime, 0, MAX_ACCUMULATED_SECONDS);
    accumulator += frameTime;

    while (accumulator >= FIXED_DT_SECONDS) {
      update(FIXED_DT_SECONDS);
      accumulator -= FIXED_DT_SECONDS;
    }
    const alpha = accumulator / FIXED_DT_SECONDS;

    render(ctx, alpha);
    requestAnimationFrame(frame);
  };

  requestAnimationFrame(frame);

  return {
    stop: () => {
      running = false;
      window.removeEventListener('resize', resize);
    },
  };
};

