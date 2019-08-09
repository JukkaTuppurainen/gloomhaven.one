import {findThinWall} from './findThinWall'
import {
  addPoint,
  neighborsOf,
  toPoint
}                     from './hexUtils'
import {
  board,
  cornersCoordinates
}                     from '../board/board'


export const getHexRange = (hex, range) => {
  const distances = [{
    x: hex.x,
    y: hex.y,
    r: 0
  }]

  for (let i = 1; i <= range; ++i) {
    distances
      .filter(hexAtDistance => hexAtDistance.r === i - 1)
      .forEach(hexToGetNeighbors => {
        const hexCorners = addPoint(cornersCoordinates, toPoint(hexToGetNeighbors))

        neighborsOf(hexToGetNeighbors, board.gridSize)
          .forEach(neighborHex => {
            if (
              neighborHex &&
              !distances.find(hex => hex.x === neighborHex.x && hex.y === neighborHex.y) &&
              board.scenario.hexes.find(hex => hex.x === neighborHex.x && hex.y === neighborHex.y)
            ) {
              const neighborCorners = addPoint(cornersCoordinates, toPoint(neighborHex))
              const commonCorners = hexCorners.filter(c1 => neighborCorners.find(c2 => (
                c1.x === c2.x && c1.y === c2.y
              )))

              if (!findThinWall(
                {
                  x: commonCorners[0].x,
                  y: commonCorners[0].y
                },
                {
                  x: commonCorners[1].x,
                  y: commonCorners[1].y
                }
              )) {
                neighborHex.r = i
                distances.push(neighborHex)
              }
            }
          })
      })
  }

  return distances
}
