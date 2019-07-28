import {
  board,
  cornersCoordinates
}                   from '../board/board'
import {
  addPoint,
  toPoint
}                   from './hexUtils'
import {isInSight}  from './isInSight'


const canvas = document.getElementById('c')
const ctx = canvas.getContext('2d')
const applyStyle = (style, hex) => typeof style === 'function' ? style(hex) : style

const drawHex = hex => {
  const [firstCorner, ...otherCorners] = addPoint(cornersCoordinates, toPoint(hex))

  ctx.beginPath()
  ctx.moveTo(firstCorner.x, firstCorner.y)
  otherCorners.forEach(c => ctx.lineTo(c.x, c.y))
  ctx.closePath()
}

const renderFunctions = []

// const drawNoHexes = () => {
//   board.grid
//     .filter(gridHex => !board.scenario.hexes.find(hex => hex.x === gridHex.x && hex.y === gridHex.y))
//     .forEach(gridHex => {
//       drawHex(gridHex)
//
//       ctx.strokeStyle = '#444'
//       ctx.stroke()
//     })
// }

const shadeWallhexes = () => {
  board.scenario.wallHexes.forEach(wallHex => {
    // Shade wall hexes always when player is on the board
    if (board.playerHex) {
      drawHex(wallHex)
      ctx.fillStyle = '#000a'
      ctx.fill()
    }
  })
}

const shadeHexesNotInSight = () => {
  ctx.fillStyle = '#000a'
  board.scenario.hexes.forEach(hex => {
    if (hex.inSight === false) {
      drawHex(hex)
      ctx.fill()
    }
  })
}

const paintMouseHex = () => {
  if (board.mouseHex) {
    drawHex(board.mouseHex)

    const style = board.style
    const isScenarioHex = board.scenario.hexes.find(hex => hex.x === board.mouseHex.x && hex.y === board.mouseHex.y)

    if (isScenarioHex && style.hexHover) {
      ctx.fillStyle = applyStyle(style.hexHover)
      // hoverHex = true
    } else if (style.noHexHover) {
      ctx.fillStyle = applyStyle(style.noHexHover)
    }

    ctx.fill()
  }
}

const paintPlayer = () => {
  if (board.playerHex) {
    drawHex(board.playerHex)
    ctx.fillStyle = '#00f8'
    ctx.fill()

    board.linesToHover = isInSight(board.playerHex, board.mouseHex, true)
  }
}

// const writeHexNumbers = () => {
//   // Numbers on hexes
//   ctx.font = '14px Arial'
//   board.scenario.hexes.forEach(gridHex => {
//     const firstCorner = addPoint(cornersCoordinates, toPoint(gridHex))[0]
//
//     ctx.fillStyle = '#000'
//     ctx.fillText(`${gridHex.x}, ${gridHex.y}`, firstCorner.x - 61, firstCorner.y - 23)
//     ctx.fillStyle = '#fff'
//     ctx.fillText(`${gridHex.x}, ${gridHex.y}`, firstCorner.x - 60, firstCorner.y - 22)
//   })
// }

// const drawWalls = () => {
//   ctx.strokeStyle = '#fff'
//   ctx.lineWidth = 1
//   board.scenario.walls.forEach(wall => {
//     ctx.beginPath()
//     ctx.moveTo(wall.x1, wall.y1)
//     ctx.lineTo(wall.x2, wall.y2)
//     ctx.stroke()
//   })
// }

const drawHoverLines = () => {
  if (board.linesToHover) {
    let shortestLine = board.linesToHover.reduce((acc, line) => {
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
    ctx.strokeStyle = '#f0fe'
    ctx.stroke()
    ctx.lineWidth = 1
    // })
  }
}

renderFunctions.push(
  // drawNoHexes,
  shadeWallhexes,
  shadeHexesNotInSight,
  paintMouseHex,
  paintPlayer,
  // writeHexNumbers,
  // drawWalls,
  drawHoverLines
)

export const renderer = () => {
  if (!board.scenario) {
    return
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height)
  renderFunctions.forEach(renderFunction => renderFunction())
}
