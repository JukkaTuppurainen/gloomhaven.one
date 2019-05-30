import {
  Hex,
  hexHeight,
  hexWidth
} from '../board/board'


export const addPoint = (corners, point) => corners.map(c => ({
  x: c.x + point.x,
  y: c.y + point.y
}))

export const toPoint = hex => {
  let y = hexHeight * hex.y

  if (hex.x % 2 === 1) {
    y += (hexHeight / 2)
  }

  return {
    x: hexWidth * hex.x * .75,
    y
  }
}

const getGridEdgeHexes = grid => {
  const lastHex = grid[grid.length - 1]
  const bottomHex = grid.reduce((accumulator, currentHex) => {
    if (
      currentHex.y > accumulator.y || (
        currentHex.y === accumulator.y &&
        currentHex.x % 2 === 1
      )
    ) {
      accumulator = currentHex
    }
    return accumulator
  }, {y: 0})

  return {
    bottomHex,
    lastHex
  }
}

export const getGridSize = grid => {
  const gridEdges = getGridEdgeHexes(grid)

  return {
    height: gridEdges.bottomHex.y + 1,
    width: gridEdges.lastHex.x + 1
  }
}

export const getGridPxSize = grid => {
  const gridEdges = getGridEdgeHexes(grid)

  return {
    pxSizeX: toPoint(gridEdges.lastHex).x + hexWidth + 1,
    pxSizeY: toPoint(gridEdges.bottomHex).y + hexHeight + 1
  }
}

export const gridGet = (hex, grid) => grid[hex.x * (grid[grid.length - 1].y + 1) + hex.y]

export const neighborsOf = ({x, y}, {height, width}) => {
  const neighbors = []
  neighbors.length = 6
  neighbors.fill(null)

  if (x < width -  1) {
    const dir0newY = y + (x % 2 === 0 ? 0 : 1)
    if (dir0newY < height) {
      neighbors[0] = {x: x + 1, y: dir0newY}
    }
  }

  if (y < height - 1) {
    neighbors[1] = {x, y: y + 1}
  }

  if (x > 0) {
    const dir2newY = y + (x % 2 === 0 ? 0 : 1)
    if (dir2newY < height) {
      neighbors[2] = {x: x - 1, y: dir2newY}
    }
    const dir3newY = y + (x % 2 === 0 ? -1 : 0)
    if (dir3newY >= 0) {
      neighbors[3] = {x: x - 1, y: dir3newY}
    }
  }

  if (y > 0) {
    neighbors[4] = {x, y: y - 1}
  }

  if (x < width -  1) {
    const dir5newY = y + (x % 2 === 0 ? -1 : 0)
    if (dir5newY >= 0) {
      neighbors[5] = {x: x + 1, y: dir5newY}
    }
  }

  return neighbors
}

export const rectangle = gridSize => {
  const rectangle = []

  for (let x = 0; x < gridSize.width; ++x) {
    for (let y = 0; y < gridSize.height; ++y) {
      rectangle.push(Hex(x, y))
    }
  }

  return rectangle
}
