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
import {
  directionFindFn,
  makeLongwall
}                               from '../lib/longWall.js'
import {makeWall}               from '../lib/makeWall'
import {render}                 from '../renderer/render'


export const clearScenario = () => {
  board.scenario = {
    hexes: new coordinateMap(),
    longWalls: [],
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

  document.getElementById('board').innerHTML = ''
  const canvas = document.getElementById('c')
  canvas.height = pxSizeY
  canvas.width = pxSizeX
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

  // Generate LOS blocking longWalls
  ;['down', 'rightUp', 'rightDown'].forEach(direction => {
    let grouping = []

    board.scenario.wallHexes.forEach(wallHex => {
      let hexesInDirection = []
      let findHex

      while (findHex = board.scenario.wallHexes.find(hex =>
        directionFindFn[direction](hex, wallHex, hexesInDirection.length + 1)
      )) {
        hexesInDirection.push(findHex)
      }

      if (hexesInDirection.length >= 2) {
        grouping.push({
          ...wallHex,
          d: hexesInDirection
        })
      }
    })

    while (grouping.length) {
      const hexWithMaxD = grouping.reduce((previousValue, currentValue) => (
        !previousValue
          ? currentValue
          : currentValue.d.length > previousValue.d.length
            ? currentValue
            : previousValue
      ))

      makeLongwall(direction, hexWithMaxD, hexWithMaxD.d.length)

      grouping = grouping.filter(groupedHex => !(
        groupedHex === hexWithMaxD ||
        hexWithMaxD.d.some(s => s.x === groupedHex.x && s.y === groupedHex.y)
      ))
    }
  })

  // Filter walls which are not needed for resolving LOS
  const xSet = new Set()
  const ySet = new Set()

  board.scenario.walls.forEach(wall => {
    xSet.add(wall.x1)
    xSet.add(wall.x2)
    ySet.add(wall.y1)
    ySet.add(wall.y2)
  })

  const xArr = [...xSet]
  const yArr = [...ySet]

  const srtr = (a, b) => a < b ? -1 : 1

  xArr.sort(srtr)
  yArr.sort(srtr)

  const minXs = xArr.slice(0, 2)
  const maxXs = xArr.slice(-2)
  const minYs = yArr.slice(0, 2)
  const maxYs = yArr.slice(-2)

  board.scenario.walls = board.scenario.walls.filter(w => !(
    (minXs.includes(w.x1) && minXs.includes(w.x2)) ||
    (maxXs.includes(w.x1) && maxXs.includes(w.x2)) ||
    (minYs.includes(w.y1) && minYs.includes(w.y2)) ||
    (maxYs.includes(w.y1) && maxYs.includes(w.y2))
  ))

  render()
}
