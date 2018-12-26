import * as Honeycomb from 'honeycomb-grid'

import {isInSight} from './lib/isInSight'
import {isPointOnSegment} from './lib/pointonsegment'

// https://stackoverflow.com/questions/31346862/test-if-a-point-is-approximately-on-a-line-segment-formed-by-two-other-points
// https://stackoverflow.com/questions/6865832/detecting-if-a-point-is-of-a-line-segment


// https://github.com/flauwekeul/honeycomb

const canvas = document.getElementById('c')

canvas.height = window.innerHeight
canvas.width = window.innerWidth

const ctx = canvas.getContext('2d')
ctx.lineWidth = 1

const Grid = Honeycomb.defineGrid(Honeycomb.extendHex({
  size: 50,
  orientation: 'flat'
}))
const grid = Grid.rectangle({width: 11, height: 13})

const mouseHex = {}
let playerHex
let monsterHex

const wallHexes = [
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

const noHexes = [
  {x: 0, y: 0},
  {x: 1, y: 0},
  {x: 2, y: 0},
  {x: 3, y: 0},
  {x: 4, y: 0},
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

const wallCorners = []

const makeWall = (hex1coords, corner1, hex2coords, corner2) => {
  let hex1 = grid.get(hex1coords)
  let hex2 = grid.get(hex2coords)

  let point1 = hex1.toPoint()
  let point2 = hex2.toPoint()

  let corners1 = hex1.corners().map(c => c.add(point1))
  let corners2 = hex2.corners().map(c => c.add(point2))

  wallCorners.push(corners1[corner1])
  wallCorners.push(corners2[corner2])

  return [
    {
      x1: corners1[corner1].x,
      y1: corners1[corner1].y,
      x2: corners2[corner2].x,
      y2: corners2[corner2].y
    }
  ]
}

const walls = [
  ...makeWall({x: 6, y: 8}, 4, {x: 6, y: 8}, 5),
  ...makeWall({x: 8, y: 8}, 4, {x: 8, y: 8}, 5)
]

wallHexes.forEach(({x, y}) => {
  const wallHex = grid.get({x, y})
  const wallHexPoint = wallHex.toPoint()
  wallCorners.push(...wallHex.corners().map(c => c.add(wallHexPoint)))

  for (let i = 0; i < 6; ++i) {
    walls.push(...makeWall({x, y}, i, {x, y}, (i < 5 ? i + 1: 0)))
  }
})

let needRender = true

// const isWallCorner = (mapX, mapY) => wallCorners.find(({x, y}) => x === mapX && y === mapY)

window.w = {
  mouseHex,
  walls
}


let losToHover

const hexes = grid.filter(
  hex => !noHexes.find(nH => nH.x === hex.x && nH.y === hex.y)
)

const render = () => {
  if (!needRender) {
    requestAnimationFrame(render)
    return
  }

  // let start = window.performance.now()

  needRender = false
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  losToHover = false

  let linesToHover = false
  let debug = new Set()

  hexes
    .forEach(hex => {
    ctx.strokeStyle = '#888'
    ctx.lineWidth = 1

    const point = hex.toPoint()
    const corners = hex.corners().map(corner => corner.add(point))
    const [firstCorner, ...otherCorners] = corners

    if (
      wallHexes.find(wallHex =>
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

      // let isMouseHex = hex.x === mouseHex.x && hex.y === mouseHex.y
      // let responseToisInSight = playerHex && isInSight(playerHex, hex, walls, isMouseHex, debug)
      //
      // if (isMouseHex && responseToisInSight instanceof Array) {
      //   linesToHover = responseToisInSight
      // }

      let isMouseHex = hex.x === mouseHex.x && hex.y === mouseHex.y
      let responseToisInSight = playerHex && isInSight(playerHex, hex, walls, isMouseHex, debug)

      if (isMouseHex && responseToisInSight instanceof Array) {
        linesToHover = responseToisInSight
      }

      // Line of sight
      // if (responseToisInSight !== false) {
      //   ctx.fillStyle = '#333'
      //   ctx.fill()
      //
      //   // Hover
      //   if (
      //     hex.x === mouseHex.x &&
      //     hex.y === mouseHex.y
      //   ) {
      //     losToHover = true
      //   }
      // }

      // Hover
      if (hex.x === mouseHex.x && hex.y === mouseHex.y) {
        ctx.fillStyle = 'rgba(50, 0, 80, .5)'
        ctx.fill()
      }

      // Player
      if (playerHex && hex.x === playerHex.x && hex.y === playerHex.y) {
        ctx.fillStyle = '#00f'
        ctx.fill()
      }

      // Monster
      if (monsterHex && hex.x === monsterHex.x && hex.y === monsterHex.y) {
        ctx.fillStyle = '#c00'
        ctx.fill()
      }

    }
  })

  ctx.strokeStyle = '#fff'
  ctx.lineWidth = 1
  walls.forEach(wall => {
    ctx.beginPath()
    ctx.moveTo(wall.x1, wall.y1)
    ctx.lineTo(wall.x2, wall.y2)
    ctx.stroke()
  })

  if (linesToHover) {
    linesToHover.forEach(line => {
      debug.forEach(debugPoint => {
        let [x, y] = debugPoint.split('-')
        x = parseFloat(x)
        y = parseFloat(y)
        ctx.beginPath()
        ctx.moveTo(x - 5, y - 5)
        ctx.lineTo(x + 5, y - 5)
        ctx.lineTo(x + 5, y + 5)
        ctx.lineTo(x - 5, y + 5)
        ctx.fillStyle = 'rgba(255, 0, 0, 1)'
        ctx.fill()
      })
      ctx.beginPath()
      ctx.moveTo(line.a, line.b)
      ctx.lineTo(line.x, line.y)
      ctx.lineWidth = 1
      ctx.strokeStyle = 'rgba(255, 0, 255, .5)'
      ctx.stroke()
    })
  }

  requestAnimationFrame(render)
}

render()

// addEventListener('mousemove', ({clientX, clientY}) => {
//   // @debug
//   w.x = clientX
//   w.y = clientY
//
//   let newMouseHex = Grid.pointToHex(clientX, clientY)
//
//   if (
//     newMouseHex.x !== mouseHex.x ||
//     newMouseHex.y !== mouseHex.y
//   ) {
//     Object.assign(mouseHex, newMouseHex)
//     needRender = true
//   }
// })

let clickFlip = false

document.addEventListener('click', ({x, y}) => {
  const clickHex = grid.get(Grid.pointToHex(x, y))
  console.log(clickHex, clickHex && clickHex.corners())

  if (
    !clickHex ||
    wallHexes.find(wHex => wHex.x === clickHex.x && wHex.y === clickHex.y) ||
    noHexes.find(wHex => wHex.x === clickHex.x && wHex.y === clickHex.y)
  ) {
    return
  }

  needRender = true

  if (clickFlip) {
    playerHex = clickHex
  } else {
    monsterHex = clickHex
  }
  clickFlip = !clickFlip
})

const fullLOSTest = () => {
  let inSight = 0
  let outSight = 0

  let start = window.performance.now();

  hexes.forEach(hex => {
    hexes.forEach(hex2 => {
      if (hex.x !== hex2.x || hex.y !== hex2.y) {
        if (isInSight(hex, hex2, walls)) {
          ++inSight
        } else {
          ++outSight
        }
      }
    })
  })
  let end = window.performance.now();

  console.log(`Full LOS test: In sight ${inSight} / Out of sight ${outSight}. Test took ${(end - start | 0)}ms.`)
}

setTimeout(fullLOSTest, 200)
