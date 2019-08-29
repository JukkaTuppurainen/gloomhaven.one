import {
  board,
  cornersCoordinates
} from '../board/board'
import {
  addPoint,
  toPoint
} from './hexUtils'


export const makeWall = (hexOrCoordinates, corner1, corner2, thin, corners) => {
  if (!corners) {
    corners = addPoint(cornersCoordinates, toPoint(hexOrCoordinates))
  }

  board.scenario.wallCorners.add(
    (corners[corner1].x * 1000 | 0) * 10000000 + (corners[corner1].y * 1000 | 0)
  )
  board.scenario.wallCorners.add(
    (corners[corner2].x * 1000 | 0) * 10000000 + (corners[corner2].y * 1000 | 0)
  )

  let wall

  if (corners[corner1].x < corners[corner2].x) {
    wall = {
      x1: corners[corner1].x,
      y1: corners[corner1].y,
      x2: corners[corner2].x,
      y2: corners[corner2].y
    }
  } else {
    wall = {
      x1: corners[corner2].x,
      y1: corners[corner2].y,
      x2: corners[corner1].x,
      y2: corners[corner1].y
    }
  }

  if (thin) {
    if (!board.scenario.thinWalls.find(t => (
      wall.x1 === t.x1 &&
      wall.y1 === t.y1 &&
      wall.x2 === t.x2 &&
      wall.y2 === t.y2
    ))) {
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
  }

  return wall
}
