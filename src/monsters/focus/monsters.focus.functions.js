import {playerNames}  from '../monsters.items'
import {board}        from '../../board/board'
import {getHexRange}  from '../../lib/getHexRange'
import {isInSight}    from '../../lib/isInSight'


export const countTrapsInPath = path =>
  path.reduce((trapCount, currentHexInPath) => (
    trapCount + (currentHexInPath.isTrap ? 1 : 0)
  ), 0)

export const deleteBoardCache = () => {
  board.scenario.hexes.forEach(hex => delete hex.rn)
}

export const findTargetsInRange = (hex, range) => {
  const targets = []

  let player
  getHexRange(hex, range).forEach(hexInRange => {
    player = board.items.find(item => (
      item.type === 'player' &&
      item.ch.x === hexInRange.x &&
      item.ch.y === hexInRange.y
    ))
    if (
      player &&
      isInSight(hex, player.ch)
    ) {
      targets.push(Object.assign(
        {},
        player,
        {r: hexInRange.r}
      ))
    }
  })

  return targets
}

export const joinAsNames = players => {
  let str = ''
  players.map(player => playerNames[player.color]).forEach((name, i) => {
    if (i > 0) {
      str += (i < players.length - 1) ? ', ' : ' & '
    }
    str += name
  })
  return str
}
