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
