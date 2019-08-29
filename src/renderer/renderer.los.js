import {drawHex}  from './renderer.functions'
import {board}    from '../board/board'


export const shadeWallhexes = ctx => {
  board.scenario.wallHexes.forEach(wallHex => {
    // Shade all wall hexes always when player is on the board
    if (board.playerHex) {
      drawHex(wallHex)
      ctx.fillStyle = '#000a'
      ctx.fill()
    }
  })
}

export const shadeHexesNotInSight = ctx => {
  ctx.fillStyle = '#000a'
  board.scenario.hexes.forEach(hex => {
    if (hex.inSight === false) {
      drawHex(hex)
      ctx.fill()
    }
  })
}

export const drawHoverLines = ctx => {
  if (board.linesToHover) {
    let shortestLine = board.linesToHover.reduce((acc, line) => {
      line.len = Math.sqrt(((line.x - line.a) ** 2) + ((line.y - line.b) ** 2))
      if (!acc || line.len < acc.len) {
        acc = line
      }
      return acc
    }, false)

    ctx.beginPath()
    ctx.moveTo(shortestLine.a, shortestLine.b)
    ctx.lineTo(shortestLine.x, shortestLine.y)
    ctx.lineWidth = 3
    ctx.strokeStyle = '#f0fe'
    ctx.stroke()
    ctx.lineWidth = 1
  }
}
