import {findThinWall} from './findThinWall'
import {
  addPoint,
  neighborsOf,
  toPoint
}                     from './hexUtils'
import {
  board,
  cornersCoordinates,
  hexHeight,
  hexWidth
}                     from '../board/board'


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

export const realNeighbors = (hex, filterItemTypes = []) => {
  const hexCorners = addPoint(cornersCoordinates, toPoint(hex))

  return neighborsOf(hex, board.gridSize)
    .filter(neighborHex => board.scenario.hexes.find(findHex => (
      neighborHex.x === findHex.x && neighborHex.y === findHex.y
    )))
    .filter(neighborHex =>
      !board.items.find(findItem =>
        filterItemTypes.includes(findItem.type) &&
        findItem.ch.x === neighborHex.x &&
        findItem.ch.y === neighborHex.y
      ))
    .filter(neighborHex => {
      const neighborCorners = addPoint(cornersCoordinates, toPoint(neighborHex))
      const commonCorners = hexCorners.filter(c1 => neighborCorners.find(c2 => (
        c1.x === c2.x && c1.y === c2.y
      )))

      return !findThinWall(commonCorners[0], commonCorners[1])
    })
    .map(neighborHex => {
      neighborHex.isDifficult = !!board.items.find(item =>
        item.ch.x === neighborHex.x &&
        item.ch.y === neighborHex.y &&
        item.type === 'difficult'
      )
      return neighborHex
    })
}

const loopAbort = 200

export const getPath = (startCoords, endCoords, filterItems = [], flying = false) => {
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

      r.pathLength = r.reduce((previousValue, currentValue) => (
        previousValue + (currentValue.isDifficult ? 2 : 1)
      ), 0)

      return r.reverse()
    }

    openList = openList.filter(hex => hex !== currentNode)

    closedList.push(currentNode)

    let neighbors = realNeighbors(currentNode, filterItems)

    for (i = 0; i < neighbors.length; ++i) {
      let neighbor = board.scenario.hexes.find(h => h.x === neighbors[i].x && h.y === neighbors[i].y)
      neighbor.isDifficult = neighbors[i].isDifficult

      if (closedList.find(h => h.x === neighbor.x && h.y === neighbor.y)) {
        continue
      }

      let gScore = currentNode.g + (neighbor.isDifficult && !flying ? 2 : 1)
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
