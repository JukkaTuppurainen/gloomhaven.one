import {board} from './board/board'


export const makeWall = (hexcoords, corner1, corner2, thin) => {
  const hex = board.grid.get(hexcoords)
  const point = hex.toPoint()
  const corners = hex.corners().map(c => c.add(point))

  board.scenario.wallCorners.add(`${corners[corner1].x}-${corners[corner1].y}` )
  board.scenario.wallCorners.add(`${corners[corner2].x}-${corners[corner2].y}` )

  const wall = {
    x1: corners[corner1].x,
    y1: corners[corner1].y,
    x2: corners[corner2].x,
    y2: corners[corner2].y
  }

  if (thin) {
    board.scenario.thinWalls.push(wall)
  }

  return wall
}
