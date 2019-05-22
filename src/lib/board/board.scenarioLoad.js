import {
  board,
  cornersCoordinates
}                 from './board'
import {
  hexCoordinatesToHexes,
  parseHexString,
  parseThinwallString
}                 from './board.functions'
import {doAction} from '../actions'
import {makeWall} from '../makeWall'
import {
  addPoint,
  getGridPxSize,
  gridGet,
  neighborsOf,
  rectangle,
  toPoint
}                 from '../hexUtils'
import {render}   from '../../index'


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

  let gridSize = {
    height: board.scenario.grid ? board.scenario.grid.height : 0,
    width: board.scenario.grid ? board.scenario.grid.width : 0
  }

  // Parse hexString, resolve needed board size and push all hexes' coordinates to temp array

  const hexCoordinates = parseHexString(hexString, gridSize, 2)

  // Initialize grid with correct size and set canvas dimensions in pixels

  if (board.editor) {
    document.getElementById('grid-height').value = gridSize.height
    document.getElementById('grid-width').value = gridSize.width
  }

  board.gridSize = gridSize
  board.grid = rectangle(gridSize)

  const {pxSizeX, pxSizeY} = getGridPxSize(board.grid)
  const canvas = document.getElementById('c')
  const canvasBackground = document.getElementById('b')

  canvas.height = pxSizeY
  canvas.width = pxSizeX

  canvasBackground.height = pxSizeY + 99
  canvasBackground.width = pxSizeX + 99

  // Get actual Hex objects from coordinates

  board.scenario.hexes = hexCoordinatesToHexes(hexCoordinates, board.grid)

  // Parse and make thinWalls

  if (thinWallString) {
    const a = parseThinwallString(thinWallString)
    a.forEach(b => {
      board.scenario.walls.push(makeWall(
        {
          x: b[0],
          y: b[1],
        },
        b[2],
        b[2] === 5 ? 0 : b[2] + 1,
        true
      ))
    })
  }

  // Generate wall hexes around tiles
  board.scenario.hexes.forEach(hex => {
    const neighbors = neighborsOf(hex, gridSize)
    neighbors.forEach(adjHex => {
      if (
        !board.scenario.hexes.find(h => h.x === adjHex.x && h.y === adjHex.y) &&
        !board.scenario.wallHexes.find(h => h.x === adjHex.x && h.y === adjHex.y)
      ) {
        board.scenario.wallHexes.push(
          gridGet(adjHex, board.grid)
        )
      }
    })
  })

  // Generate LOS blocking walls...
  board.scenario.wallHexes.forEach(wallHex => {
    const wallHexPoint = toPoint(wallHex)
    const corners = addPoint(cornersCoordinates, wallHexPoint)

    // ... around the wall hex
    for (let i = 0; i < 6; ++i) {
      board.scenario.walls.push(makeWall(wallHex, i, (i < 5 ? i + 1 : 0), false, corners))
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
