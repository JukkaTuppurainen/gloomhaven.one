import {
  board,
  Grid
}                 from './board'
import {doAction} from '../actions'
import {makeWall} from '../makeWall'
import {render}   from '../../index'


const fromChar = c => {
  let n = c.charCodeAt(0)
  return n > 96 ? n - 96 : n - 38
}

export const scenarioLoad = scenario => {
  board.scenario = {
    hexes: [],
    thinWalls: [],
    wallCorners: new Set(),
    wallHexes: [],
    walls: []
  }

  Object.assign(board.scenario, scenario)

  const hexString = scenario.blueprint.split('.')[0]
  const thinWallString = scenario.blueprint.split('.')[1]
  const hexCoordinates = []
  let end
  let i = 0
  let previousLastY = 0
  let start
  let x = 1

  let gridSize = {
    height: board.scenario.grid ? board.scenario.grid.height : 0,
    width: board.scenario.grid ? board.scenario.grid.width : 0
  }

  // Parse hexString, resolve needed board size and push all hexes coordinates to temp array

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

      if (end + 2 > gridSize.height) {
        gridSize.height = end + 2
      }

      if (x + 2 > gridSize.width) {
        gridSize.width = x + 2
      }

      for (let y = start; y <= end; ++y) {
        hexCoordinates.push(x, y)
      }

      i += 2
    }
  }

  // Initialize grid and set canvas dimensions in pixels

  if (board.editor) {
    document.getElementById('grid-height').value = gridSize.height
    document.getElementById('grid-width').value = gridSize.width
  }

  board.gridSize = gridSize
  board.grid = Grid.rectangle(gridSize)

  let maxX = 0
  let maxY = 0

  board.grid.forEach(hex => {
    const point = hex.toPoint()
    const corners = hex.corners().map(corner => corner.add(point))
    corners.forEach(c => {
      if (c.x > maxX) {
        maxX = c.x
      }
      if (c.y > maxY) {
        maxY = c.y
      }
    })
  })

  const canvas = document.getElementById('c')
  const canvasBackground = document.getElementById('b')

  canvas.height = maxY + 1
  canvas.width = maxX + 1

  canvasBackground.height = maxY + 100
  canvasBackground.width = maxX + 100

  // Get actual Hex objects from coordinates

  for (i = 0; i < hexCoordinates.length; i += 2) {
    const gridHex = board.grid.get({
      x: hexCoordinates[i],
      y: hexCoordinates[i + 1]
    })
    if (gridHex) {
      board.scenario.hexes.push(gridHex)
    }
  }

  // Parse thinWalls

  if (thinWallString) {
    let s
    let x
    let y
    i = 0

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

        board.scenario.walls.push(makeWall(
          {x, y},
          s,
          s === 5 ? 0 : s + 1,
          true
        ))
      }
    }
  }

  // Generate wall hexes around tiles
  board.scenario.hexes.forEach(hex => {
    board.grid.neighborsOf(hex).forEach(adjHex => {
      if (
        !board.scenario.hexes.find(h => h.x === adjHex.x && h.y === adjHex.y) &&
        !board.scenario.wallHexes.find(h => h.x === adjHex.x && h.y === adjHex.y)
      ) {
        board.scenario.wallHexes.push(adjHex)
      }
    })
  })

  // Generate LOS blocking walls...
  board.scenario.wallHexes.forEach(({x, y}) => {
    const wallHex = board.grid.get({x, y})
    const wallHexPoint = wallHex.toPoint()
    const corners = wallHex.corners().map(c => c.add(wallHexPoint))

    // ... around the wall hex
    for (let i = 0; i < 6; ++i) {
      board.scenario.walls.push(makeWall({x, y}, i, (i < 5 ? i + 1 : 0)))
    }

    // ... and three throuhg the hex
    board.scenario.walls.push(
      {
        x1: (corners[4].x + corners[5].x) / 2,
        y1: corners[4].y,
        x2: (corners[1].x + corners[2].x) / 2,
        y2: corners[1].y
      },
      {
        x1: (corners[3].x + corners[4].x) / 2,
        y1: (corners[3].y + corners[4].y) / 2,
        x2: (corners[0].x + corners[1].x) / 2,
        y2: (corners[0].y + corners[1].y) / 2,
      },
      {
        x1: (corners[2].x + corners[3].x) / 2,
        y1: (corners[2].y + corners[3].y) / 2,
        x2: (corners[5].x + corners[0].x) / 2,
        y2: (corners[5].y + corners[0].y) / 2,
      }
    )
  })

  if (scenario.bitmap) {
    const img = new Image()
    img.src = scenario.bitmap

    img.onload = () => {
      const ctx2 = canvasBackground.getContext('2d')
      ctx2.drawImage(img, 90, 158, img.width * scenario.bitmapScale, img.height * scenario.bitmapScale)
    }
  }

  doAction('scenarioLoad')

  render()
}
