import {board}   from '../board/board.js'
import {
  hexHeight,
  hexSize,
  hexWidth
}                from '../board/board.constants.js'
import {toPoint} from './hexUtils.js'


export const directionFindFn = {
  down: (hex, originHex, distance) => (
    hex.x === originHex.x &&
    hex.y === originHex.y + distance
  ),
  rightDown: (hex, originHex, distance) => (
    hex.x === originHex.x + distance &&
    hex.y === originHex.y + ((distance - (hex.x & 1)) / 2 | 0) + (originHex.x & 1)
  ),
  rightUp: (hex, originHex, distance) => (
    hex.x === originHex.x + distance &&
    hex.y === originHex.y - ((distance + (hex.x & 1)) / 2 | 0)
  )
}

export const makeLongwall = (direction, hex, distance) => {
  const point = toPoint(hex)

  switch (direction) {
    case 'down':
      board.scenario.longWalls.push({
        x1: point.x + hexSize,
        y1: point.y,
        x2: point.x + hexSize,
        y2: point.y + (hexHeight * (distance + 1))
      })
      break
    case 'rightDown':
      board.scenario.longWalls.push({
        x1: point.x + (hexSize / 4),
        y1: point.y + (hexHeight * .25),
        x2: point.x + (hexWidth * .75 * (distance + 1)) + (hexWidth * .125),
        y2: point.y + (hexHeight / 2 * distance) + (hexHeight * .75)
      })
      break
    case 'rightUp':
      board.scenario.longWalls.push({
        x1: point.x + (hexSize / 4),
        y1: point.y + (hexHeight * .75),
        x2: point.x + (hexWidth * .75 * (distance + 1)) + (hexWidth * .125),
        y2: point.y - (hexHeight / 2 * distance) + (hexHeight / 4)
      })
      break
  }
}
