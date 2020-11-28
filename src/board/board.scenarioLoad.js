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

  // Generate LOS blocking walls
  board.scenario.wallHexes.forEach(wallHex => {
    const corners = addPoint(cornersCoordinates, toPoint(wallHex))

    neighborsOf(wallHex, board.gridSize).forEach((neighbor, i) => {
      if (
        neighbor !== null &&
        board.scenario.hexes.has(neighbor)
      ) {
        board.scenario.walls.push(makeWall(wallHex, i, (i < 5 ? i + 1 : 0), false, corners))
      }
    })
  })

  render()
}
