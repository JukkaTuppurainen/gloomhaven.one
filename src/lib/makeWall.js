import {board} from './Board'


export const makeWall = (hex1coords, corner1, hex2coords, corner2, thin) => {
  let hex1 = board.grid.get(hex1coords)
  let hex2 = board.grid.get(hex2coords)

  let point1 = hex1.toPoint()
  let point2 = hex2.toPoint()

  let corners1 = hex1.corners().map(c => c.add(point1))
  let corners2 = hex2.corners().map(c => c.add(point2))

  board.scenario.wallCorners.push(corners1[corner1])
  board.scenario.wallCorners.push(corners2[corner2])

  const wall = {
    x1: corners1[corner1].x,
    y1: corners1[corner1].y,
    x2: corners2[corner2].x,
    y2: corners2[corner2].y
  }

  if (thin) {
    board.scenario.thinWalls.push(wall)
  }

  return wall
}
