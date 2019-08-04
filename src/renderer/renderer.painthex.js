import {drawHex}    from './renderer.functions'
import {board}      from '../board/board'
import {isInSight}  from '../lib/isInSight'


export const paintMouseHex = ctx => {
  if (board.mouseHex) {
    drawHex(board.mouseHex)

    const style = board.style
    const isScenarioHex = board.scenario.hexes.find(hex => hex.x === board.mouseHex.x && hex.y === board.mouseHex.y)

    if (isScenarioHex && style.hexHover) {
      ctx.fillStyle = style.hexHover
    } else if (style.noHexHover) {
      ctx.fillStyle = style.noHexHover
    }

    ctx.fill()
  }
}

export const paintPlayer = ctx => {
  if (board.playerHex) {
    drawHex(board.playerHex)
    ctx.fillStyle = '#00f8'
    ctx.fill()

    board.linesToHover = isInSight(board.playerHex, board.mouseHex, true)
  }
}
