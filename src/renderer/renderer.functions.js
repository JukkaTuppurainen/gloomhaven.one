import {cornersCoordinates} from '../board/board'
import {
  addPoint,
  toPoint
}                           from '../lib/hexUtils'


const ctx = document.getElementById('c').getContext('2d')

export const drawHex = hex => {
  const [firstCorner, ...otherCorners] = addPoint(cornersCoordinates, toPoint(hex))

  ctx.beginPath()
  ctx.moveTo(firstCorner.x, firstCorner.y)
  otherCorners.forEach(c => ctx.lineTo(c.x, c.y))
  ctx.closePath()
}

export const drawTriangle = (x, y, offset, angle, height, width) => {
  ctx.beginPath()

  x += offset * Math.cos(angle)
  y += offset * Math.sin(angle)

  ctx.moveTo(x, y)
  ctx.lineTo(
    x + (height * Math.cos(angle + width)),
    y + (height * Math.sin(angle + width)),
  )
  ctx.lineTo(
    x + (height * Math.cos(angle - width)),
    y + (height * Math.sin(angle - width)),
  )
  ctx.closePath()
  ctx.fill()
}
