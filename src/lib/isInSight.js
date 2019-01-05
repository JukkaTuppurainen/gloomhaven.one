import {intersects} from './intersects'
import {isPointOnSegment} from './isPointOnSegment'
import {getCornerOffset} from './getCornerOffset'

let cache = {}

// Current correct value 3891 / 3249

export const isInSight = (hex1, hex2, board, returnLines) => {
  let corners1
  if (cache.x !== hex1.x || cache.y !== hex1.y) {
    const point1 = hex1.toPoint()
    corners1 = hex1.corners().map(c => c.add(point1))
    cache = {
      x: hex1.x,
      y: hex1.y,
      corners: corners1,
    }
  } else {
    corners1 = cache.corners
  }

  const point2 = hex2.toPoint()
  const corners2 = hex2.corners().map(c => c.add(point2))
  let los = false
  let lines = []

  let c2index
  corners1.forEach(c1 => {
    if (returnLines || !los) {
      c2index = 0
      corners2.forEach(c2 => {
        if (returnLines || !los) {
          let ok = true
          board.walls.forEach(wall => {
            if (ok && intersects(
              c1.x, c1.y, c2.x, c2.y,
              wall.x1, wall.y1, wall.x2, wall.y2
            )) {
              ok = false
            }
            if (ok) {
              if (
                isPointOnSegment(c1, {x: wall.x1, y: wall.y1}, c2) ||
                isPointOnSegment(c1, {x: wall.x2, y: wall.y2}, c2)
              ) {
                ok = false
              }
            }
          })

          if (ok) {
            let nextc2 = c2index === 5 ? 0 : c2index + 1
            let prevc2 = c2index === 0 ? 5 : c2index - 1
            let offset1 = null
            let offset2 = null

            if (
              board.isThinWallCorner(c2.x, c2.y) &&
              board.isThinWallCorner(corners2[nextc2].x, corners2[nextc2].y)
            ) {
              offset1 = getCornerOffset(hex2.x, hex2.y, c2index, board)
              offset2 = getCornerOffset(hex2.x, hex2.y, nextc2, board)
            }

            if (
              board.isThinWallCorner(c2.x, c2.y) &&
              board.isThinWallCorner(corners2[prevc2].x, corners2[prevc2].y)
            ) {
              offset1 = getCornerOffset(hex2.x, hex2.y, c2index, board)
              offset2 = getCornerOffset(hex2.x, hex2.y, prevc2, board)
            }

            if (offset1 && offset2 && intersects(
              c1.x, c1.y, c2.x, c2.y,
              offset1.x, offset1.y, offset2.x, offset2.y
            )) {
              ok = false
            }
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
  })

  return los && returnLines
    ? lines
    : los
}
