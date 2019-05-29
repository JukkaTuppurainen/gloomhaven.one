import {
  board,
  Grid
}               from './board'
import {render} from '../../index'


export const boardMousemove = event => {
  let newMouseHex = Grid.pointToHex(event.layerX, event.layerY)

  if (
    newMouseHex.x !== board.mouseHex.x ||
    newMouseHex.y !== board.mouseHex.y
  ) {
    Object.assign(board.mouseHex, newMouseHex)
    render()
  }
}

export const boardClick = event => {
  const clickHex = Grid.pointToHex(event.layerX, event.layerY)
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

  render()
}
