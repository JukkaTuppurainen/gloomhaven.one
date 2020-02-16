import {
  board,
  cornersCoordinates
}                               from './board'
import {getDataFromBoardPieces} from './board.functions'
import {coordinateMap}          from '../lib/coordinateMap'
import {
  addPoint,
  getGridPxSize,
  getGridSize,
  neighborsOf,
  rectangle,
  toPoint
}                               from '../lib/hexUtils'
import {makeWall}               from '../lib/makeWall'
import {render}                 from '../renderer/render'


export const clearScenario = () => {
  board.scenario = {
    hexes: [],
    thinWalls: [],
    wallCorners: new Set(),
    wallHexes: [],
    walls: []
  }
}

export const scenarioInit = () => {
  clearScenario()

  board.pieces = []

  const gridSize = {
    height: 40,
    width: 40
  }

  // Initialize grid with temporary size and set canvas dimensions in pixels
  board.gridSize = gridSize
  board.grid = rectangle(gridSize)

  const {pxSizeX, pxSizeY} = getGridPxSize(board.grid)

  if (/* global ENV_isTest */ !ENV_isTest) {
    document.getElementById('board').innerHTML = ''
    const canvas = document.getElementById('c')
    canvas.height = pxSizeY
    canvas.width = pxSizeX
  }
}

export const resizeCanvas = () => {
  if (!board.editor && board.scenario.hexes.length) {
    const flatHexes = []
    board.scenario.hexes.forEach(hex => flatHexes.push(hex))

    const gridSize = getGridSize(flatHexes)
    ++gridSize.height
    ++gridSize.width

    board.gridSize = gridSize
    board.grid = rectangle(gridSize)

    const {pxSizeX, pxSizeY} = getGridPxSize(board.grid)
    const canvas = document.getElementById('c')

    canvas.height = Math.max(pxSizeY, window.innerHeight - 12)
    canvas.width = Math.max(pxSizeX, window.innerWidth - 12 - board.pxOffset)
  }
}

export const scenarioLoad = scenario => {
  Object.assign(board.scenario, scenario)
  const dataFromPieces = getDataFromBoardPieces()
  board.scenario.hexes = new coordinateMap(dataFromPieces.hexes)

  // Resize the canvas and grid to match the scenario layout
  resizeCanvas()

  // Make thinWalls
  dataFromPieces.thinWalls.forEach(thinWall => {
    board.scenario.walls.push(makeWall(
      thinWall,
      thinWall.s,
      thinWall.s === 5 ? 0 : thinWall.s + 1,
      true
    ))
  })

  // Generate wall hexes around tiles
  board.scenario.hexes.forEach(hex => {
    neighborsOf(hex, board.gridSize).forEach(neighborHex => {
      if (
        neighborHex !== null &&
        !board.scenario.hexes.has(neighborHex) &&
        !board.scenario.wallHexes.find(h => h.x === neighborHex.x && h.y === neighborHex.y)
      ) {
        board.scenario.wallHexes.push(neighborHex)
      }
    })
  })

  // Generate LOS blocking walls...
  board.scenario.wallHexes.forEach(wallHex => {
    const corners = addPoint(cornersCoordinates, toPoint(wallHex))

    // ... around the wall hex
    neighborsOf(wallHex, board.gridSize).forEach((neighbor, i) => {
      if (
        neighbor !== null &&
        board.scenario.hexes.has(neighbor)
      ) {
        board.scenario.walls.push(makeWall(wallHex, i, (i < 5 ? i + 1 : 0), false, corners))
      }
    })

    // ... and three throuhg the hex
    // (these may be disabled without 2nd LOS mode)
    // board.scenario.walls.push(
    //   {
    //     x1: (corners[4].x + corners[5].x) / 2,
    //     y1: corners[4].y,
    //     x2: (corners[1].x + corners[2].x) / 2,
    //     y2: corners[1].y
    //   },
    //   {
    //     x1: (corners[3].x + corners[4].x) / 2,
    //     y1: (corners[3].y + corners[4].y) / 2,
    //     x2: (corners[0].x + corners[1].x) / 2,
    //     y2: (corners[0].y + corners[1].y) / 2,
    //   },
    //   {
    //     x1: (corners[2].x + corners[3].x) / 2,
    //     y1: (corners[2].y + corners[3].y) / 2,
    //     x2: (corners[5].x + corners[0].x) / 2,
    //     y2: (corners[5].y + corners[0].y) / 2,
    //   }
    // )
  })

  render()
}
