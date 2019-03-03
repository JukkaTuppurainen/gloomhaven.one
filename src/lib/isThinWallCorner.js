import {board} from './board/board'


export const isThinWallCorner = (mapX, mapY) => (
  board.scenario.thinWalls.find(thinWall => (
    (thinWall.x1 === mapX && thinWall.y1 === mapY) ||
    (thinWall.x2 === mapX && thinWall.y2 === mapY)
  ))
)
