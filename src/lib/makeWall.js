import {
  board,
  cornersCoordinates
} from './board/board'
import {
  addPoint,
  toPoint
} from './hexUtils'


export const makeWall = (hexOrCoordinates, corner1, corner2, thin, corners) => {
  if (!corners) {
    corners = addPoint(cornersCoordinates, toPoint(hexOrCoordinates))
  }

  board.scenario.wallCorners.add(`${corners[corner1].x}-${corners[corner1].y}`)
  board.scenario.wallCorners.add(`${corners[corner2].x}-${corners[corner2].y}`)

  const wall = {
    x1: corners[corner1].x,
    y1: corners[corner1].y,
    x2: corners[corner2].x,
    y2: corners[corner2].y
  }

  if (thin) {
    board.scenario.thinWalls.push(Object.assign(
      {},
      wall,
      {
        meta: {
          x: hexOrCoordinates.x,
          y: hexOrCoordinates.y,
          s: corner1
        }
      }
    ))
  }

  return wall
}
