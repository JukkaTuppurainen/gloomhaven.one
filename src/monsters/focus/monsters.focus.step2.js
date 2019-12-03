import {monsterValues}  from '../monsters.controls'
import {board}          from '../../board/board'
import {getHexRange}    from '../../lib/getHexRange'
import {getPath}        from '../../lib/getPath'
import {isInSight}      from '../../lib/isInSight'


const getPathsToPlayersHexRange = (players, range, monster, paths, maxTrapsInPath = 0) => {
  let hexesToAttackFrom = []

  let allowedItemsInTargetHex = monsterValues.mt < 2
    ? maxTrapsInPath === 0
      ? ['difficult']
      : ['difficult', 'trap']
    : ['difficult', 'trap', 'obstacle']

  let notAllowedItemsInPath = monsterValues.mt === 0
    ? ['obstacle', 'player']
    : []

  players.forEach(player => {
    getHexRange(player.ch, range)
      .filter(hex => !board.items.some(item => (
        item.ch.x === hex.x &&
        item.ch.y === hex.y &&
        !allowedItemsInTargetHex.includes(item.type)
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
    path = getPath(monster.ch, attackHex, notAllowedItemsInPath, monsterValues.mt)
    if (path.length) {
      let ok = false

      if (monsterValues.mt === 0) {
        const trapsInPath = path.reduce((trapCount, currentHexInPath) => (
          trapCount + (currentHexInPath.isTrap ? 1 : 0)
        ), 0)
        if (trapsInPath <= maxTrapsInPath) {
          ok = true
        }
      } else {
        ok = true
      }

      if (ok) {
        path.targets = attackHex.targets
        paths.push(path)
        board.focusInfo.focusHexes.push(attackHex)
      }
    }
  })

  return paths
}

export const getPathsToAttack = (monster, focus, paths, players) => {
  const trapsCount = monsterValues.mt < 2
    ? board.items.filter(item => item.type === 'trap').length
    : 0

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
    focus.messages.push(`I have no focus ${
      players.length
        ? 'because I do not have a single path to any target.'
        : 'as all my enemies has fallen before me!'
    }`)
  }
}
