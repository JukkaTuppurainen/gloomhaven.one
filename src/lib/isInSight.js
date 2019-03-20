import {board}            from './board/board'
import {getCornerOffset}  from './getCornerOffset'
import {intersects}       from './intersects'
import {isPointOnSegment} from './isPointOnSegment'
import {isThinWallCorner} from './isThinWallCorner'


let cache = {}

// Current correct value 3796 / 3344

const getOffsets = (hex, corner1, corner2, cornerIndex1, cornerIndex2) => {
  if (
    isThinWallCorner(corner1.x, corner1.y) &&
    isThinWallCorner(corner2.x, corner2.y)
  ) {
    return [
      getCornerOffset(hex.x, hex.y, cornerIndex1),
      getCornerOffset(hex.x, hex.y, cornerIndex2)
    ]
  }
}

export const isInSight = (hex1, hex2, returnLines) => {
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

  let c1index = 0
  let c2index

  corners1.forEach(c1 => {
    if ((
      returnLines || !los
    ) && (
      board.losMode || !board.scenario.wallCorners.has(`${c1.x}-${c1.y}`)
    )) {
      c2index = 0
      corners2.forEach(c2 => {
        if ((
          returnLines || !los
        ) && (
          board.losMode || !board.scenario.wallCorners.has(`${c2.x}-${c2.y}`)
        )) {
          let ok = true
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

          if (ok) {
            let nextc1 = c1index === 5 ? 0 : c1index + 1
            let prevc1 = c1index === 0 ? 5 : c1index - 1
            let nextc2 = c2index === 5 ? 0 : c2index + 1
            let prevc2 = c2index === 0 ? 5 : c2index - 1
            let offsets

            if (!offsets) {
              offsets = getOffsets(hex1, c1, corners1[nextc1], c1index, nextc1)
            }

            if (!offsets) {
              offsets = getOffsets(hex1, c1, corners1[prevc1], c1index, prevc1)
            }

            if (!offsets) {
              offsets = getOffsets(hex2, c2, corners2[nextc2], c2index, nextc2)
            }

            if (!offsets) {
              offsets = getOffsets(hex2, c2, corners2[prevc2], c2index, prevc2)
            }

            if (offsets && intersects(
              c1.x, c1.y, c2.x, c2.y,
              offsets[0].x, offsets[0].y, offsets[1].x, offsets[1].y
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
    ++c1index
  })

  return los && returnLines
    ? lines
    : los
}
