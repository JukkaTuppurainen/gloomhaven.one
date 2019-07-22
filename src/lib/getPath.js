import {
  addPoint,
  neighborsOf,
  toPoint
} from './hexUtils'
import {
  board,
  cornersCoordinates,
  hexHeight,
  hexWidth
} from '../board/board'


let endHex
let endHexCenter
let hexCenterX
let hexCenterY

const initHexes = hexes => {
  hexCenterX = hexWidth / 2
  hexCenterY = hexHeight / 2

  hexes.forEach(hex => {
    hex.f = 0
    hex.g = 0
    hex.h = 0
    hex.parent = null
  })
}

const heuristic = hex => {
  let hexPoint = toPoint(hex)
  let hexCenter = {
    x: hexPoint.x + hexCenterX,
    y: hexPoint.y + hexCenterY
  }

  // return Math.max(Math.abs(hex.x - endHex.x), Math.abs(hex.y - endHex.y)) * 1.2
  return Math.sqrt(((hexCenter.x - endHexCenter.x) ** 2) + ((hexCenter.y - endHexCenter.y) ** 2)) / 100
}

const realNeighbors = hex => {
    let hexCorners = addPoint(cornersCoordinates, toPoint(hex)).map(c => {
      return {
        x: ((c.x * 1000) | 0) / 1000,
        y: ((c.y * 1000) | 0) / 1000
      }
    })

  return neighborsOf(hex, board.gridSize)
    .filter(neighborHex => board.scenario.hexes.find(findHex => (
      neighborHex.x === findHex.x && neighborHex.y === findHex.y
    )))
    .filter(neighborHex => {
      let neighborCorners = addPoint(cornersCoordinates, toPoint(neighborHex)).map(c => {
        return {
          x: ((c.x * 1000) | 0) / 1000,
          y: ((c.y * 1000) | 0) / 1000
        }
      })

      let commonCorners = hexCorners.filter(c1 => neighborCorners.find(c2 => (
        c1.x === c2.x && c1.y === c2.y
      )))

      if (commonCorners.length !== 2) {
        throw Error('Rounding error: two adjecent hexes does not have two common corners')
      }

      return !board.scenario.thinWalls.find(thin => {
        const t = {
          x1: ((thin.x1 * 1000) | 0) / 1000,
          y1: ((thin.y1 * 1000) | 0) / 1000,
          x2: ((thin.x2 * 1000) | 0) / 1000,
          y2: ((thin.y2 * 1000) | 0) / 1000
        }

        return (
          (commonCorners[0].x === t.x1 && commonCorners[0].y === t.y1 && commonCorners[1].x === t.x2 && commonCorners[1].y === t.y2) ||
          (commonCorners[1].x === t.x1 && commonCorners[1].y === t.y1 && commonCorners[0].x === t.x2 && commonCorners[0].y === t.y2)
        )
      })

    })
}

const loopAbort = 200

export const getPath = (board, startCoords, endCoords) => {
  let loopIteration = 0

  initHexes(board.scenario.hexes)

  const start = board.scenario.hexes.find(a => a.x === startCoords.x && a.y === startCoords.y)
  const end = board.scenario.hexes.find(a => a.x === endCoords.x && a.y === endCoords.y)

  let endPoint = toPoint(end)
  endHexCenter = {
    x: endPoint.x + hexCenterX,
    y: endPoint.y + hexCenterY
  }
  endHex = end

  let openList = []
  let closedList = []
  let i

  openList.push(start)

  while (openList.length && loopIteration < loopAbort) {
    ++loopIteration

    if (loopIteration === loopAbort) {
      throw Error('getPath reached maximum allowed iterations')
    }

    let lowest = 0

    for (i = 0; i < openList.length; ++i) {
      if (openList[i].f < openList[lowest].f) {
        lowest = i
      }
    }

    let currentNode = openList[lowest]

    if (currentNode.x === end.x && currentNode.y === end.y) {
      let current = currentNode
      let r = []
      while (current.parent) {
        r.push(current)
        current = current.parent
      }

      return r.reverse()
    }

    openList = openList.filter(hex => hex !== currentNode)

    closedList.push(currentNode)

    let neighbors = realNeighbors(currentNode)

    for (i = 0; i < neighbors.length; ++i) {
      let neighbor = board.scenario.hexes.find(h => h.x === neighbors[i].x && h.y === neighbors[i].y)

      if (closedList.find(h => h.x === neighbor.x && h.y === neighbor.y)) {
        continue
      }

      let gScore = currentNode.g + 1
      let gScoreIsBest = false

      if (!openList.find(hex => (
        hex.x === neighbor.x && hex.y === neighbor.y
      ))) {
        gScoreIsBest = true
        neighbor.h = heuristic(neighbor)
        openList.push(neighbor)
      } else if (gScore < neighbor.g) {
        gScoreIsBest = true
      }

      if (gScoreIsBest) {
        neighbor.parent = currentNode
        neighbor.g = gScore
        neighbor.f = neighbor.g + neighbor.h
      }
    }
  }

  return []
}

// window.getPath = (startX, startY, endX, endY) => {
//   performance.mark('A* start')
//   console.log(
//     getPath(board, {x: startX, y: startY}, {x: endX, y: endY})
//   )
//   performance.mark('A* end')
//   performance.measure('A*', 'A* start', 'A* end')
//   console.log(`A* took %c${performance.getEntriesByName('A*').pop().duration}%cms`, 'color:#9980ff', 'color:#d5d5d5')
//
//   render()
// }
//
// window.realNeighbors = (x, y) => {
//   console.log('Neighbors', realNeighbors({x, y}))
// }
