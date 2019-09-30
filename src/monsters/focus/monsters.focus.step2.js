import {monsterValues}  from '../monsters.controls'
import {board}          from '../../board/board'
import {getHexRange}    from '../../lib/getHexRange'
import {getPath}        from '../../lib/getPath'
import {isInSight}      from '../../lib/isInSight'


const getPathsToPlayersHexRange = (players, range, monster, paths, maxTrapsInPath = 0) => {
  let hexesToAttackFrom = []

  players.forEach(player => {
    getHexRange(player.ch, range)
      .filter(hex => !board.items.find(item => (
        item.ch.x === hex.x &&
        item.ch.y === hex.y && (
          (maxTrapsInPath === 0 && item.type !== 'difficult') ||
          (maxTrapsInPath > 0 && item.type !== 'difficult' && item.type !== 'trap')
        )
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
      const trapsInPath = path.reduce((trapCount, currentHexInPath) => (
        trapCount + (currentHexInPath.isTrap ? 1 : 0)
      ), 0)

      if (trapsInPath <= maxTrapsInPath) {
        path.targets = attackHex.targets
        paths.push(path)
        board.focusInfo.focusHexes.push(attackHex)
      }
    }
  })

  return paths
}

export const getPathsToAttack = (monster, focus, paths, players) => {
  const trapsCount = board.items.filter(item => item.type === 'trap').length

  let tryPathingWithTraps = 0
  while (!paths.length && tryPathingWithTraps <= trapsCount) {
    paths = getPathsToPlayersHexRange(
      players,
      monsterValues.range || 1,
      monster,
      paths,
      tryPathingWithTraps
    )

    ++tryPathingWithTraps
  }

  if (!paths.length) {
    focus.player = false
    focus.messages.push('I have no focus because I do not have a single path to any target.')
  }
}
