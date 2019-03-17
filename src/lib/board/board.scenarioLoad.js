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
    wallCorners: new Set(),
    wallHexes: [],
    walls: []
  }

  Object.assign(board.scenario, scenario)

  if (scenario.blueprint.thinWalls) {
    const tw = scenario.blueprint.thinWalls
    for (let i = 0; i < tw.length; i += 3) {
      board.scenario.walls.push(makeWall(
        {x: tw[i], y: tw[i + 1]},
        tw[i + 2],
        tw[i + 2] === 5 ? 0 : tw[i + 2] + 1,
        true
      ))
    }
  }

  const pushHexesToBoard = (hexes, target) => {
    hexes.forEach(hex => {
      let loopX = parseBlueprintHex(hex.x)
      let loopY = parseBlueprintHex(hex.y)
      let x
      let y

      for (y = loopY[0]; y <= loopY[1]; ++y) {
        for (x = loopX[0]; x <= loopX[1]; ++x) {
          const gridHex = board.grid.get({x, y})
          if (gridHex) {
            Object.keys(hex).forEach(p => {
              if (typeof gridHex[p] === 'undefined') {
                gridHex[p] = hex[p]
              }
            })

            board.scenario[target].push(gridHex)
          }
        }
      }
    })
  }

  pushHexesToBoard(scenario.blueprint.hexes, 'hexes')
  pushHexesToBoard(scenario.blueprint.wallHexes, 'wallHexes')

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
      ctx2.drawImage(img, 0, 0, img.width * scenario.bitmapScale, img.height * scenario.bitmapScale)
    }
  }

  render()
}
