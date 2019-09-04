import {monsterValues}  from '../monsters.controls'
import {board}          from '../../board/board'
import {getHexRange}    from '../../lib/getHexRange'
import {getPath}        from '../../lib/getPath'
import {isInSight}      from '../../lib/isInSight'


export const getPathsToAttack = (monster, focus, paths) => {
  const hexesToAttackFrom = []
  const players = board.items.filter(item => item.type === 'player')

  players.forEach(player => {
    getHexRange(player.ch, monsterValues.range || 1)
      .filter(hex => !board.items.find(item => (
        item.ch.x === hex.x &&
        item.ch.y === hex.y &&
        item.type !== 'difficult'
      )))
      .filter(hex => isInSight(player.ch, hex))
      .forEach(freeHexInRange => {
        const alreadyHexToAttackFrom = hexesToAttackFrom.find(a => (
          a.x === freeHexInRange.x && a.y === freeHexInRange.y
        ))
        if (alreadyHexToAttackFrom) {
          alreadyHexToAttackFrom.targets.push(player)
        } else {
          freeHexInRange.targets = [player]
          hexesToAttackFrom.push(freeHexInRange)
        }
      })
  })

  let path
  hexesToAttackFrom.forEach(attackHex => {
    path = getPath(monster.ch, attackHex, ['obstacle', 'player'])
    if (path.length) {
      path.targets = attackHex.targets
      paths.push(path)
      board.focusInfo.focusHexes.push(attackHex)
    }
  })

  if (!paths.length) {
    focus.player = false
    focus.messages.push('I have no focus because I do not have a single path to any target.')
  }
}
