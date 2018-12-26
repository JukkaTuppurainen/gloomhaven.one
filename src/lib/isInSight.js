import {intersects} from './intersects'
import {isPointOnSegment} from './pointonsegment'

let cache = {}

export const isInSight = (hex1, hex2, walls, returnLines, debug) => {
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

  corners1.forEach(c1 => {
    if (returnLines || !los) {
      corners2.forEach(c2 => {
        if (returnLines || !los) {
          let ok = true
          walls.forEach(wall => {
            if (ok && intersects(
              c1.x, c1.y, c2.x, c2.y,
              wall.x1, wall.y1, wall.x2, wall.y2
            )) {
              ok = false
            }
            if (returnLines && ok && debug) {
              if (isPointOnSegment(c1, {x: wall.x1, y: wall.y1}, c2)) {
                debug.add(`${wall.x1}-${wall.y1}`)
              }
              if (isPointOnSegment(c1, {x: wall.x2, y: wall.y2}, c2)) {
                debug.add(`${wall.x2}-${wall.y2}`)
              }
            }
          })
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
      })
    }
  })

  return los && returnLines
    ? lines
    : los
}
