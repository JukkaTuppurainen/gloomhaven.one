import {board} from '../board/board'


export const findThinWall = (corner1, corner2) => {
  let a, b, x, y

  if (corner1.x < corner2.x) {
    a = corner1.x
    b = corner1.y
    x = corner2.x
    y = corner2.y
  } else {
    x = corner1.x
    y = corner1.y
    a = corner2.x
    b = corner2.y
  }

  return board.scenario.thinWalls.find(scenarioThinWall => (
    a === scenarioThinWall.x1 &&
    b === scenarioThinWall.y1 &&
    x === scenarioThinWall.x2 &&
    y === scenarioThinWall.y2
  ))
}
