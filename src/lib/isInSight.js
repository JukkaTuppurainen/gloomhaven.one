import {
  board,
  cornersCoordinates
}                         from '../board/board'
import {
  addPoint,
  toPoint
}                         from './hexUtils'
import {intersects}       from './intersects'
import {isPointOnSegment} from './isPointOnSegment'


let cache = {}

export const isInSight = (hex1, hex2, returnLines) => {
  let corners1
  if (cache.x !== hex1.x || cache.y !== hex1.y) {
    corners1 = addPoint(cornersCoordinates, toPoint(hex1))
    cache = {
      x: hex1.x,
      y: hex1.y,
      corners: corners1,
    }
  } else {
    corners1 = cache.corners
  }

  const corners2 = addPoint(cornersCoordinates, toPoint(hex2))
  let los = false
  let lines = []

  let c1index = 0
  let c2index

  corners1.forEach(c1 => {
    if ((
      returnLines || !los
    ) && (
      board.losMode ||
      !board.scenario.wallCorners.has((c1.x * 1000 | 0) * 10000000 + (c1.y * 1000 | 0))
    )) {
      c2index = 0
      corners2.forEach(c2 => {
        if ((
          returnLines || !los
        ) && (
          board.losMode ||
          !board.scenario.wallCorners.has((c2.x * 1000 | 0) * 10000000 + (c2.y * 1000 | 0))
        )) {
          let ok = true

          board.scenario.longWalls.forEach(longwall => {
            if (ok && intersects(
              c1.x, c1.y, c2.x, c2.y,
              longwall.x1, longwall.y1, longwall.x2, longwall.y2
            )) {
              ok = false
            }
          })

          if (ok) {
            board.scenario.walls.forEach(wall => {
              if (ok && intersects(
                c1.x, c1.y, c2.x, c2.y,
                wall.x1, wall.y1, wall.x2, wall.y2
              )) {
                ok = false
              }
              if (ok && (
                isPointOnSegment(c1, {x: wall.x1, y: wall.y1}, c2) ||
                isPointOnSegment(c1, {x: wall.x2, y: wall.y2}, c2)
              )) {
                ok = false
              }
            })
          }

          if (ok) {
            if (returnLines) {
              lines.push({
                a: c1.x,
                b: c1.y,
                x: c2.x,
                y: c2.y
              })
            }
            los = true
          }
        }
        ++c2index
      })
    }
    ++c1index
  })

  return los && returnLines
    ? lines
    : los
}
