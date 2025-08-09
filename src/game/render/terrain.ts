import type { Heightmap } from '../terrain/types'

export const renderTerrainFromHeightmap = (
  ctx: CanvasRenderingContext2D,
  heights: Heightmap,
  _canvasWidth: number,
  canvasHeight: number,
  color: string = '#334155',
): void => {
  if (heights.length <= 1) return
  ctx.save()
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.moveTo(0, canvasHeight)
  for (let x = 0; x < heights.length; x += 1) {
    ctx.lineTo(x, heights[x])
  }
  ctx.lineTo(heights.length - 1, canvasHeight)
  ctx.closePath()
  ctx.fill()
  ctx.restore()
}

export const renderTerrainOutline = (
  ctx: CanvasRenderingContext2D,
  heights: Heightmap,
  strokeStyle: string = '#94a3b8',
): void => {
  if (heights.length <= 1) return
  ctx.save()
  ctx.strokeStyle = strokeStyle
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(0, heights[0])
  for (let x = 1; x < heights.length; x += 1) {
    ctx.lineTo(x, heights[x])
  }
  ctx.stroke()
  ctx.restore()
}

