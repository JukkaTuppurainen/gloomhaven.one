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
import {
  hexHeight,
  hexWidth
}                     from '../board/board.constants'
import {flagFloor}    from '../monsters/monsters.items'


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

  return Math.sqrt(
    ((hexCenter.x - endHexCenter.x) ** 2) + ((hexCenter.y - endHexCenter.y) ** 2)
  ) / 100
}

const realNeighbors = (hex, filterItemTypes = []) => {
  if (!hex.rn) {
    const hexCorners = addPoint(cornersCoordinates, toPoint(hex))
    hex.rn = neighborsOf(hex, board.gridSize)
      .filter(neighborHex => board.scenario.hexes.some(findHex => (
        neighborHex.x === findHex.x && neighborHex.y === findHex.y
      )))
      .filter(neighborHex => {
        const neighborCorners = addPoint(cornersCoordinates, toPoint(neighborHex))
        const commonCorners = hexCorners.filter(c1 => neighborCorners.find(c2 => (
          c1.x === c2.x && c1.y === c2.y
        )))

        return !findThinWall(commonCorners[0], commonCorners[1])
      })
  }

  return hex.rn
    .filter(neighborHex =>
      !board.items.some(findItem =>
        filterItemTypes.includes(findItem.type) &&
        findItem.ch.x === neighborHex.x &&
        findItem.ch.y === neighborHex.y
      ))
    .map(neighborHex => {
      let floorItemInHex = board.items.find(item =>
        item.ch.x === neighborHex.x &&
        item.ch.y === neighborHex.y &&
        item.stacks === flagFloor
      )

      neighborHex.isDifficult = !!(floorItemInHex && floorItemInHex.type === 'difficult')
      neighborHex.isTrap = !!(floorItemInHex && floorItemInHex.type === 'trap')
      return neighborHex
    })
}

export const getPath = (startCoords, endCoords, filterItems = [], movementType = 0) => {
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
  let closedList = {}
  let i

  openList.push(start)

  while (openList.length) {
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

      r.pathLength = r.reduce((previousValue, currentValue, i) =>
        previousValue + ((
          currentValue.isDifficult && (
            movementType === 0 || (movementType === 1 && i === 0)
          )
        ) ? 2 : 1), 0)
      r.hasTraps = r.some(rHex => rHex.isTrap)

      return r.reverse()
    }

    openList = openList.filter(hex => hex !== currentNode)

    let clx1 = closedList[currentNode.x]
    if (clx1) {
      clx1.push(currentNode.y)
    } else {
      closedList[currentNode.x] = [currentNode.y]
    }

    let neighbors = realNeighbors(currentNode, filterItems)

    for (i = 0; i < neighbors.length; ++i) {
      let neighbor = board.scenario.hexes.find(h =>
        h.x === neighbors[i].x && h.y === neighbors[i].y
      )

      neighbor.isDifficult = neighbors[i].isDifficult
      neighbor.isTrap = neighbors[i].isTrap

      let clx2 = closedList[neighbor.x]
      if (clx2 && clx2.includes(neighbor.y)) {
        continue
      }

      let gScore = currentNode.g
      if (movementType === 0) {
        if (neighbor.isDifficult) { gScore += 2 }
        else if (neighbor.isTrap) { gScore += 100 }
        else ++gScore
      } else {
        gScore += 1
      }

      let gScoreIsBest = false

      if (!openList.some(hex => (
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
