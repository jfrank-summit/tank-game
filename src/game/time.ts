export const FIXED_DT_SECONDS = 1 / 60;
export const MAX_ACCUMULATED_SECONDS = 0.25;

export const nowSeconds = (): number => performance.now() / 1000;

export const clamp = (value: number, min: number, max: number): number => {
  if (value < min) return min;
  if (value > max) return max;
  return value;
};

