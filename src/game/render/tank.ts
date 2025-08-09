export type Vec2 = { x: number; y: number }

export const renderTank = (
  ctx: CanvasRenderingContext2D,
  position: Vec2,
  radius: number,
  color: string = '#eab308',
): void => {
  ctx.save()
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.arc(position.x, position.y, radius, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()
}

