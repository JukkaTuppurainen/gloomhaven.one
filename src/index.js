import {
  board,
  Grid
} from './lib/Board'
import {isInSight} from './lib/isInSight'
import {scenarioList} from './scenarios'


const canvas = document.getElementById('c')
const ctx = canvas.getContext('2d')

export const render = () => {
  if (!board.scenario) {
    return
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height)

  let linesToHover = false
  const style = board.scenario.style

  board.scenario.hexes.forEach(hex => {
    const point = hex.toPoint()
    const corners = hex.corners().map(corner => corner.add(point))
    const [firstCorner, ...otherCorners] = corners

    if (
      board.scenario.wallHexes.find(wallHex =>
        wallHex.x === hex.x && wallHex.y === hex.y
      )
    ) {
      if (style && style.walls) {
        ctx.beginPath()
        ctx.moveTo(firstCorner.x, firstCorner.y)
        otherCorners.forEach(({x, y}) => ctx.lineTo(x, y))
        ctx.lineTo(firstCorner.x, firstCorner.y)
        if (style.walls.line) {
          ctx.strokeStyle = style.walls.line
          ctx.stroke()
        }
        if (style.walls.fill) {
          ctx.fillStyle = style.walls.fill
          ctx.fill()
        }
      }

      // Shade wall hexes always when player is on the board
      if (board.playerHex) {
        ctx.beginPath()
        ctx.moveTo(firstCorner.x, firstCorner.y)
        otherCorners.forEach(({x, y}) => ctx.lineTo(x, y))
        ctx.lineTo(firstCorner.x, firstCorner.y)
        ctx.fillStyle = 'rgba(0, 0, 0, .6)'
        ctx.fill()
      }
    } else {
      ctx.beginPath()
      ctx.moveTo(firstCorner.x, firstCorner.y)
      otherCorners.forEach(({x, y}) => ctx.lineTo(x, y))
      ctx.lineTo(firstCorner.x, firstCorner.y)

      if (style && style.hexes) {
        if (style.hexes.line) {
          ctx.strokeStyle = style.hexes.line
          ctx.stroke()
        }

        if (style.hexes.fill) {
          ctx.fillStyle = style.hexes.fill
          ctx.fill()
        }
      }

      ctx.closePath()

      let isMouseHex = hex.x === board.mouseHex.x && hex.y === board.mouseHex.y
      let responseToisInSight = board.playerHex && isInSight(board.playerHex, hex, isMouseHex)

      if (isMouseHex && responseToisInSight instanceof Array) {
        linesToHover = responseToisInSight
      }

      // Line of sight
      if (responseToisInSight === false) {
        ctx.fillStyle = 'rgba(0, 0, 0, .6)'
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
        ctx.fillStyle = 'rgba(0, 0, 255, .5)'
        ctx.fill()
      }
    }
  })

  if (style && style.noHexes) {
    board.scenario.noHexes.forEach(noHexCoords => {
      const noHex = board.grid.get(noHexCoords)
      const point = noHex.toPoint()
      const corners = noHex.corners().map(corner => corner.add(point))
      const [firstCorner, ...otherCorners] = corners

      ctx.beginPath()
      ctx.moveTo(firstCorner.x, firstCorner.y)
      otherCorners.forEach(({x, y}) => ctx.lineTo(x, y))
      ctx.lineTo(firstCorner.x, firstCorner.y)

      if (style.noHexes.line) {
        ctx.strokeStyle = style.noHexes.line
        ctx.stroke()
      }
      if (style.noHexes.fill) {
        ctx.fillStyle = style.noHexes.fill
        ctx.fill()
      }
    })
  }

  // Draw walls
  // if (renderDebug) {
  //   ctx.strokeStyle = '#fff'
  //   ctx.lineWidth = 1
  //   board.scenario.walls.forEach(wall => {
  //     ctx.beginPath()
  //     ctx.moveTo(wall.x1, wall.y1)
  //     ctx.lineTo(wall.x2, wall.y2)
  //     ctx.stroke()
  //   })
  // }

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
    ctx.lineWidth = 3
    ctx.strokeStyle = 'rgba(255, 0, 255, .9)'
    ctx.stroke()
    ctx.lineWidth = 1
    // })
  }
}

render()

const scenarioSelect = document.getElementById('scenario')
for (let [id, scenario] of Object.entries(scenarioList)) {
  const option = document.createElement('option')
  option.value = id
  option.innerText = scenario.name
  scenarioSelect.appendChild(option)
}

scenarioSelect.addEventListener('change', event => {
  board.loadScenario(event.target.value)
})

scenarioSelect.value = 1
board.loadScenario(1)

canvas.addEventListener('mousemove', ({layerX, layerY}) => {
  let newMouseHex = Grid.pointToHex(layerX, layerY)

  if (
    newMouseHex.x !== board.mouseHex.x ||
    newMouseHex.y !== board.mouseHex.y
  ) {
    Object.assign(board.mouseHex, newMouseHex)
    requestAnimationFrame(render)
  }
})

canvas.addEventListener('click', ({layerX, layerY}) => {
  const clickHex = board.grid.get(Grid.pointToHex(layerX, layerY))
  // if (clickHex) {
  //   const point = clickHex.toPoint()
  //   const corners = clickHex.corners().map(corner => corner.add(point))
  //   console.log('clickHex:', clickHex, clickHex && corners)
  // }

  if (
    !clickHex ||
    board.scenario.wallHexes.find(wHex => wHex.x === clickHex.x && wHex.y === clickHex.y) ||
    board.scenario.noHexes.find(wHex => wHex.x === clickHex.x && wHex.y === clickHex.y)
  ) {
    return
  }

  board.playerHex = (
    board.playerHex &&
    clickHex.x === board.playerHex.x &&
    clickHex.y === board.playerHex.y
  )
    ? null
    : clickHex

  requestAnimationFrame(render)
})

document.getElementById('los-mode').addEventListener('change', event => {
  board.losMode = event.target.value === '1'
  render()
})

// const fullLOSTest = () => {
//   let inSight = 0
//   let outSight = 0
//
//   let start = window.performance.now()
//
//   const hexesToTest = board.scenario.hexes.filter(h => (
//     !board.scenario.wallHexes.find(wh => (
//       h.x === wh.x && h.y === wh.y
//     ))
//   ))
//
//   hexesToTest.forEach(hex => {
//     hexesToTest.forEach(hex2 => {
//       if (hex.x !== hex2.x || hex.y !== hex2.y) {
//         if (isInSight(hex, hex2)) {
//           ++inSight
//         } else {
//           ++outSight
//         }
//       }
//     })
//   })
//   let end = window.performance.now()
//
//   console.log(`Full LOS test: In sight ${inSight} / Out of sight ${outSight}. Test took ${(end - start | 0)}ms.`)
// }
//
// setTimeout(fullLOSTest, 200)
