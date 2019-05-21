import {
  hexHeight,
  hexWidth
} from './board/board'


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

export const getGridPxSize = grid => {
  const lastPoint = toPoint(grid[grid.length - 1])
  const bottomPoint = toPoint(grid.reduce((accumulator, currentHex) => {
    if (
      currentHex.y > accumulator.y || (
        currentHex.y === accumulator.y &&
        currentHex.x % 2 === 1
      )
    ) {
      accumulator = currentHex
    }
    return accumulator
  }, {y: 0}))

  return {
    pxSizeX: lastPoint.x + hexWidth + 1,
    pxSizeY: bottomPoint.y + hexHeight + 1
  }
}

export const gridGet = (hex, grid) => grid[hex.x * (grid[grid.length - 1].y + 1) + hex.y]

export const neighborsOf = ({x, y}, {height, width}) => {
  const neighbors = []

  if (y > 0) {
    neighbors.push({x, y: y - 1})
  }

  if (y < height - 1) {
    neighbors.push({x, y: y + 1})
  }

  if (x > 0) {
    const dir3newY = y + (x % 2 === 0 ? -1 : 0)
    if (dir3newY >= 0) {
      neighbors.push({x: x - 1, y: dir3newY})
    }

    const dir2newY = y + (x % 2 === 0 ? 0 : 1)
    if (dir2newY < height) {
      neighbors.push({x: x - 1, y: dir2newY})
    }
  }

  if (x < width -  1) {
    const dir5newY = y + (x % 2 === 0 ? -1 : 0)
    if (dir5newY >= 0) {
      neighbors.push({x: x + 1, y: dir5newY})
    }

    const dir0newY = y + (x % 2 === 0 ? 0 : 1)
    if (dir0newY < height) {
      neighbors.push({x: x + 1, y: dir0newY})
    }
  }

  return neighbors
}
