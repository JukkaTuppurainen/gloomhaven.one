import * as Honeycomb from 'honeycomb-grid'

import {isInSight} from './lib/isInSight'
import {getCornerOffset} from './lib/getCornerOffset'

// https://stackoverflow.com/questions/31346862/test-if-a-point-is-approximately-on-a-line-segment-formed-by-two-other-points
// https://stackoverflow.com/questions/6865832/detecting-if-a-point-is-of-a-line-segment
// https://github.com/flauwekeul/honeycomb

// @todo: implement this (or maybe not?)
// https://github.com/davidfig/intersects

const canvas = document.getElementById('c')

const ctx = canvas.getContext('2d')
ctx.lineWidth = 1

window.ctx = ctx

const board = {
  mouseHex: {
    x: null,
    y: null
  },
  orientation: 'flat' // 'pointy'
}

window.board = board

const Grid = Honeycomb.defineGrid(Honeycomb.extendHex({
  size: 60,
  orientation: board.orientation
}))
board.grid = Grid.rectangle({width: 11, height: 13})

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

canvas.height = maxY + 1
canvas.width = maxX + 1

// let monsterHex

board.wallHexes = [
  {x: 4, y: 0},
  {x: 5, y: 0},
  {x: 5, y: 1},
  {x: 5, y: 2},
  {x: 5, y: 4},
  {x: 5, y: 5},
  {x: 5, y: 6},
  {x: 0, y: 7},
  {x: 1, y: 6},
  {x: 2, y: 7},
  {x: 3, y: 6},
  {x: 4, y: 7},
  {x: 5, y: 7},

  {x: 9, y: 0},
  {x: 9, y: 1},
  {x: 9, y: 2},
  {x: 9, y: 3},
  {x: 9, y: 4},
  {x: 9, y: 5},
  {x: 9, y: 6},
  {x: 9, y: 7},
  {x: 10, y: 7},

  {x: 3, y: 7},
  {x: 3, y: 8},
  {x: 3, y: 9},
  {x: 3, y: 10},
  {x: 3, y: 11},
  {x: 3, y: 12}
]

board.thinWalls = []

board.noHexes = [
  {x: 0, y: 0},
  {x: 1, y: 0},
  {x: 2, y: 0},
  {x: 3, y: 0},
  {x: 0, y: 8},
  {x: 0, y: 9},
  {x: 0, y: 10},
  {x: 0, y: 11},
  {x: 0, y: 12},
  {x: 1, y: 7},
  {x: 1, y: 8},
  {x: 1, y: 9},
  {x: 1, y: 10},
  {x: 1, y: 11},
  {x: 1, y: 12},
  {x: 2, y: 8},
  {x: 2, y: 9},
  {x: 2, y: 10},
  {x: 2, y: 11},
  {x: 2, y: 12},
  {x: 5, y: 12},
  {x: 7, y: 12},
  {x: 9, y: 12},
  {x: 10, y: 0},
  {x: 10, y: 1},
  {x: 10, y: 2},
  {x: 10, y: 3},
  {x: 10, y: 4},
  {x: 10, y: 5},
  {x: 10, y: 6}
]

board.wallCorners = []

const makeWall = (hex1coords, corner1, hex2coords, corner2, thin) => {
  let hex1 = board.grid.get(hex1coords)
  let hex2 = board.grid.get(hex2coords)

  let point1 = hex1.toPoint()
  let point2 = hex2.toPoint()

  let corners1 = hex1.corners().map(c => c.add(point1))
  let corners2 = hex2.corners().map(c => c.add(point2))

  board.wallCorners.push(corners1[corner1])
  board.wallCorners.push(corners2[corner2])

  const wall = {
    x1: corners1[corner1].x,
    y1: corners1[corner1].y,
    x2: corners2[corner2].x,
    y2: corners2[corner2].y
  }

  if (thin) {
    board.thinWalls.push(wall)
  }

  return wall
}

board.walls = [
  makeWall({x: 6, y: 8}, 4, {x: 6, y: 8}, 5, true, {x1: -10}),
  makeWall({x: 8, y: 8}, 4, {x: 8, y: 8}, 5, true, {x2: 10})
]

board.wallHexes.forEach(({x, y}) => {
  const wallHex = board.grid.get({x, y})
  const wallHexPoint = wallHex.toPoint()
  const corners = wallHex.corners().map(c => c.add(wallHexPoint))
  board.wallCorners.push(...corners)

  for (let i = 0; i < 6; ++i) {
    board.walls.push(makeWall({x, y}, i, {x, y}, (i < 5 ? i + 1: 0)))
  }

  board.walls.push(
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

let needRender = true

board.isThinWallCorner = (mapX, mapY) => (
  board.thinWalls.find(thinWall => (
    (thinWall.x1 === mapX && thinWall.y1 === mapY) ||
    (thinWall.x2 === mapX && thinWall.y2 === mapY)
  ))
)

board.hexes = board.grid.filter(
  hex => !board.noHexes.find(nH => nH.x === hex.x && nH.y === hex.y)
)

const render = () => {
  if (!needRender) {
    requestAnimationFrame(render)
    return
  }

  needRender = false
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  let linesToHover = false

  const mouseHex = board.grid.get({x: board.mouseHex.x, y: board.mouseHex.y})

  if (mouseHex) {
    const mouseHexPoint = mouseHex.toPoint()
    const mouseHexCorners = mouseHex.corners().map(corner => corner.add(mouseHexPoint))
    for (let i = 0; i < 6; ++i) {
      let nextCorner = i === 5 ? 0 : i + 1
      if (
        board.isThinWallCorner(mouseHexCorners[i].x, mouseHexCorners[i].y) &&
        board.isThinWallCorner(mouseHexCorners[nextCorner].x, mouseHexCorners[nextCorner].y)
      ) {
        const offsets1 = getCornerOffset(board.mouseHex.x, board.mouseHex.y, i, board)
        const offsets2 = getCornerOffset(board.mouseHex.x, board.mouseHex.y, nextCorner, board)

        setTimeout(() => {
          ctx.strokeStyle = '#fff'
          ctx.beginPath()
          ctx.moveTo(offsets1.x, offsets1.y)
          ctx.lineTo(offsets2.x, offsets2.y)
          ctx.stroke()
        })
      }
    }
  }

  board.hexes.forEach(hex => {
    ctx.strokeStyle = '#888'
    ctx.lineWidth = 1

    const point = hex.toPoint()
    const corners = hex.corners().map(corner => corner.add(point))
    const [firstCorner, ...otherCorners] = corners

    if (
      board.wallHexes.find(wallHex =>
        wallHex.x === hex.x && wallHex.y === hex.y
      )
    ) {
      ctx.beginPath()
      ctx.moveTo(firstCorner.x, firstCorner.y)
      otherCorners.forEach(({x, y}) => ctx.lineTo(x, y))
      ctx.lineTo(firstCorner.x, firstCorner.y)
      ctx.fillStyle = '#222'
      ctx.fill()
      ctx.closePath()
    } else {
      ctx.beginPath()
      ctx.moveTo(firstCorner.x, firstCorner.y)
      otherCorners.forEach(({x, y}) => ctx.lineTo(x, y))
      ctx.lineTo(firstCorner.x, firstCorner.y)
      ctx.stroke()

      let isMouseHex = hex.x === board.mouseHex.x && hex.y === board.mouseHex.y
      let responseToisInSight = board.playerHex && isInSight(board.playerHex, hex, board, isMouseHex)

      if (isMouseHex && responseToisInSight instanceof Array) {
        linesToHover = responseToisInSight
      }

      // let isMonsterHex = monsterHex && hex.x === monsterHex.x && hex.y === monsterHex.y
      // let responseToisInSight = playerHex && isInSight(playerHex, hex, walls, isMonsterHex)
      //
      // if (isMonsterHex && responseToisInSight instanceof Array) {
      //   linesToHover = responseToisInSight
      // }

      // Line of sight
      if (responseToisInSight !== false) {
        ctx.fillStyle = '#333'
        ctx.fill()
      }

      // Hover
      if (
        hex.x === board.mouseHex.x &&
        hex.y === board.mouseHex.y
      ) {
        ctx.fillStyle = 'rgba(50, 0, 80, .5)'
        ctx.fill()
      }

      // Player
      if (board.playerHex && hex.x === board.playerHex.x && hex.y === board.playerHex.y) {
        ctx.fillStyle = '#00f'
        ctx.fill()
      }

      // Monster
      // if (monsterHex && hex.x === monsterHex.x && hex.y === monsterHex.y) {
      //   ctx.fillStyle = '#c00'
      //   ctx.fill()
      // }

    }
  })

  ctx.strokeStyle = '#fff'
  ctx.lineWidth = 1
  board.walls.forEach(wall => {
    ctx.beginPath()
    ctx.moveTo(wall.x1, wall.y1)
    ctx.lineTo(wall.x2, wall.y2)
    ctx.stroke()
  })

  if (linesToHover) {
    let shortestLine = linesToHover.reduce((acc, line) => {
      line.len = Math.sqrt(((line.x - line.a) ** 2) + ((line.y - line.b) ** 2))
      if (!acc || line.len < acc.len) {
        acc = line
      }
      return acc
    }, false)

    // linesToHover.forEach(line => {
    ctx.beginPath()
    ctx.moveTo(shortestLine.a, shortestLine.b)
    ctx.lineTo(shortestLine.x, shortestLine.y)
    ctx.lineWidth = 1
    ctx.strokeStyle = 'rgba(255, 0, 255, .9)'
    ctx.stroke()
    // })
  }

  requestAnimationFrame(render)
}

render()

addEventListener('mousemove', ({layerX, layerY}) => {
  let newMouseHex = Grid.pointToHex(layerX, layerY)

  if (
    newMouseHex.x !== board.mouseHex.x ||
    newMouseHex.y !== board.mouseHex.y
  ) {
    Object.assign(board.mouseHex, newMouseHex)
    needRender = true
  }
})

// let clickFlip = false

document.addEventListener('click', ({layerX, layerY}) => {
  const clickHex = board.grid.get(Grid.pointToHex(layerX, layerY))
  if (clickHex) {
    const point = clickHex.toPoint()
    const corners = clickHex.corners().map(corner => corner.add(point))

    console.log('clickHex:', clickHex, clickHex && corners)
  }

  if (
    !clickHex ||
    board.wallHexes.find(wHex => wHex.x === clickHex.x && wHex.y === clickHex.y) ||
    board.noHexes.find(wHex => wHex.x === clickHex.x && wHex.y === clickHex.y)
  ) {
    return
  }

  needRender = true

  // if (clickFlip) {
  board.playerHex = clickHex
  // } else {
  //   monsterHex = clickHex
  // }
  // clickFlip = !clickFlip
})

const fullLOSTest = () => {
  let inSight = 0
  let outSight = 0

  let start = window.performance.now()

  const hexesToTest = board.hexes.filter(h => (
    !board.wallHexes.find(wh => (
      h.x === wh.x && h.y === wh.y
    ))
  ))

  hexesToTest.forEach(hex => {
    hexesToTest.forEach(hex2 => {
      if (hex.x !== hex2.x || hex.y !== hex2.y) {
        if (isInSight(hex, hex2, board)) {
          ++inSight
        } else {
          ++outSight
        }
      }
    })
  })
  let end = window.performance.now()

  console.log(`Full LOS test: In sight ${inSight} / Out of sight ${outSight}. Test took ${(end - start | 0)}ms.`)
}

setTimeout(fullLOSTest, 200)
