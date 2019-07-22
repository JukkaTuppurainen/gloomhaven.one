import {board}      from './board'
import {pointToHex} from '../lib/hexUtils'
import {render}     from '../index'
import {resolveLOS} from '../lib/resolveLOS'


export const boardMousemove = event => {
  const newMouseHex = pointToHex(event.layerX, event.layerY)

  if (
    newMouseHex.x >= 0 &&
    newMouseHex.y >= 0 &&
    newMouseHex.x < board.gridSize.width &&
    newMouseHex.y < board.gridSize.height
  ) {
    if (
      newMouseHex.x !== board.mouseHex.x ||
      newMouseHex.y !== board.mouseHex.y
    ) {
      board.mouseHex = newMouseHex
      render()
    }
  } else if (board.mouseHex.x !== null) {
    board.mouseHex = {
      x: null,
      y: null
    }
    render()
  }
}

export const boardMouseLeave = () => {
  board.mouseHex = {
    x: null,
    y: null
  }
  render()
}

export const boardClick = event => {
  const clickHex = pointToHex(event.layerX, event.layerY)
  // if (clickHex) {
  //   console.log('clickHex:', clickHex)
  // }

  if (
    !clickHex ||
    !board.scenario.hexes.find(wHex => wHex.x === clickHex.x && wHex.y === clickHex.y)
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

  resolveLOS()
  render()
}
