import {board}      from '../board/board'
import {isInSight}  from './isInSight'


export const resolveLOS = () => {
  board.scenario.hexes.forEach(hex =>
    hex.inSight = board.playerHex
      ? isInSight(board.playerHex, hex)
      : true
  )
}
