import {gridGet} from '../hexUtils'


export const fromChar = c => {
  let n = c.charCodeAt(0)
  return n > 96 ? n - 96 : n - 38
}

export const parseThinwallString = (thinWallString) => {
  let s
  let x = 0
  let y
  let i = 0
  const walls = []

  while (i < thinWallString.length) {
    let m = thinWallString.substr(i).match(/^\d+/)
    if (m) {
      x = parseInt(m[0], 10)
      i += m[0].length
    } else {
      y = fromChar(thinWallString.substr(i, 1))
      ++i

      if (i === thinWallString.length || thinWallString.substr(i, 1).match(/\d/)) {
        s = 1
      } else {
        s = fromChar(thinWallString[i]) - 1
        ++i
      }

      walls.push([x, y, s])
    }
  }

  return walls
}

export const parseHexString = (hexString, gridSize, gridSizeAdjust = 0, hexCoordAdjust = 0) => {
  let end
  let i = 0
  let previousLastY = 0
  let start
  let x = 1

  const hexCoordinates = []

  while (i < hexString.length) {
    let m = hexString.substr(i).match(/^\d+/)
    if (m) {
      x = parseInt(m[0], 10)
      i += m[0].length
      previousLastY = 0
    } else {
      start = fromChar(hexString.substr(i, 1))
      end = fromChar(hexString.substr(i + 1, 1))

      if (start <= previousLastY) {
        ++x
      }

      previousLastY = end

      if (end + gridSizeAdjust > gridSize.height) {
        gridSize.height = end + gridSizeAdjust
      }

      if (x + gridSizeAdjust > gridSize.width) {
        gridSize.width = x + gridSizeAdjust
      }

      for (let y = start; y <= end; ++y) {
        hexCoordinates.push(x + hexCoordAdjust, y + hexCoordAdjust)
      }

      i += 2
    }
  }

  return hexCoordinates
}

export const hexCoordinatesToHexes = (hexCoordinates, grid) => {
  const hexes = []

  for (let i = 0; i < hexCoordinates.length; i += 2) {
    const gridHex = gridGet({
      x: hexCoordinates[i],
      y: hexCoordinates[i + 1]
    }, grid)
    if (gridHex) {
      hexes.push(gridHex)
    }
  }

  return hexes
}
