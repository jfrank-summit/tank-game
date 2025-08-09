export const renderProjectile = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  color: string = '#f59e0b',
): void => {
  ctx.save()
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.arc(x, y, 3, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()
}

export const renderTrail = (
  ctx: CanvasRenderingContext2D,
  points: Array<{ x: number; y: number }>,
  color: string = 'rgba(245, 158, 11, 0.35)',
): void => {
  if (points.length < 2) return
  ctx.save()
  ctx.strokeStyle = color
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(points[0].x, points[0].y)
  for (let i = 1; i < points.length; i += 1) {
    ctx.lineTo(points[i].x, points[i].y)
  }
  ctx.stroke()
  ctx.restore()
}

