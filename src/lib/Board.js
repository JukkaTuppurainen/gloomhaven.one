import * as Honeycomb from 'honeycomb-grid/src/honeycomb'

import {makeWall} from './makeWall'
import {scenarioList} from '../scenarios'


const hexSize = 60
const orientation = 'flat' // 'pointy'

const Grid = Honeycomb.defineGrid(Honeycomb.extendHex({
  size: hexSize,
  orientation
}))

const board = {
  grid: null,
  loadScenario: id => {
    scenarioList[id].file.then(scenario => {
      scenario = scenario.default

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
        thinWalls: [],
        wallCorners: [],
        walls: []
      }

      Object.assign(board.scenario, scenario)

      board.scenario._tmp_walls.forEach(w => {
        board.scenario.walls.push(makeWall(...w))
      })
      delete board.scenario._tmp_walls

      // Create array of actual playable hexes
      board.scenario.hexes = board.grid.filter(
        hex => !board.scenario.noHexes.find(nH => nH.x === hex.x && nH.y === hex.y)
      )

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

      const img = document.createElement('img')
      img.src = scenario.bitmap

      img.onload = () => {
        const ctx2 = canvasBackground.getContext('2d')
        ctx2.drawImage(img, 0, 0, img.width * scenario.bitmapScale, img.height * scenario.bitmapScale)
      }
    })
  },
  losMode: false,
  mouseHex: {
    x: null,
    y: null
  },
  scenario: null,
  settings: {
    hexSize,
    orientation
  }
}

board.loadScenario(1)

export {
  board,
  Grid
}
