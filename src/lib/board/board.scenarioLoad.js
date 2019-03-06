import {
  board,
  Grid
}                 from './board'
import {makeWall} from '../makeWall'
import {render}   from '../../index'


const parseBlueprintHex = input => {
  if (typeof input === 'number') {
    return [input, input]
  }
  let m = input.match(/(\d+)-(\d+)/)
  return [
    parseInt(m[1], 10),
    parseInt(m[2], 10)
  ]
}

export const scenarioLoad = scenario => {
  board.grid = Grid.rectangle(scenario.grid)

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

  board.scenario = {
    hexes: [],
    thinWalls: [],
    wallCorners: [],
    wallHexes: [],
    walls: []
  }

  Object.assign(board.scenario, scenario)

  if (scenario.blueprint.thinWalls) {
    scenario.blueprint.thinWalls.forEach(w => {
      board.scenario.walls.push(makeWall(...w, true))
    })
  }

  const pushHexesToBoard = (hexes, target) => {
    hexes.forEach(hex => {
      let loopX = parseBlueprintHex(hex.x)
      let loopY = parseBlueprintHex(hex.y)
      let x
      let y

      for (y = loopY[0]; y <= loopY[1]; ++y) {
        for (x = loopX[0]; x <= loopX[1]; ++x) {
          let gridHex = board.grid.get({x, y})
          Object.keys(hex).forEach(p => {
            if (typeof gridHex[p] === 'undefined') {
              gridHex[p] = hex[p]
            }
          })

          board.scenario[target].push(gridHex)
        }
      }
    })
  }

  pushHexesToBoard(scenario.blueprint.hexes, 'hexes')
  pushHexesToBoard(scenario.blueprint.wallHexes, 'wallHexes')

  // Generate LOS blocking walls
  board.scenario.wallHexes.forEach(({x, y}) => {
    const wallHex = board.grid.get({x, y})
    const wallHexPoint = wallHex.toPoint()
    const corners = wallHex.corners().map(c => c.add(wallHexPoint))
    board.scenario.wallCorners.push(...corners)

    // Around the wall hex
    for (let i = 0; i < 6; ++i) {
      board.scenario.walls.push(makeWall({x, y}, i, {x, y}, (i < 5 ? i + 1 : 0)))
    }

    // And two throuhg the hex
    board.scenario.walls.push(
      {
        x1: corners[0].x,
        y1: corners[0].y,
        x2: corners[3].x,
        y2: corners[3].y
      },
      {
        x1: (corners[4].x + corners[5].x) / 2,
        y1: corners[4].y,
        x2: (corners[1].x + corners[2].x) / 2,
        y2: corners[1].y
      }
    )
  })

  if (scenario.bitmap) {
    const img = document.createElement('img')
    img.src = scenario.bitmap

    img.onload = () => {
      const ctx2 = canvasBackground.getContext('2d')
      ctx2.drawImage(img, 0, 0, img.width * scenario.bitmapScale, img.height * scenario.bitmapScale)
    }
  }

  render()
}
