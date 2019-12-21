import {joinAsNames}    from './monsters.focus.functions'
import {monsterValues}  from '../monsters.controls'
import {
  genders,
  playerNames
}                       from '../monsters.items'
import {board}          from '../../board/board'
import {getPath}        from '../../lib/getPath'


export const filterInShortestPaths = (monster, focus, paths, players) => {
  let message = ''

  if (paths[0].hasTraps) {
    if (monsterValues.mt === 0) {
      let trapCount = paths[0].filter(hex => hex.isTrap).length
      focus.traps = trapCount
      message += `There are no safe paths to ${
        players.length === 1
          ? 'the enemy'
          : 'enemies'
      }. By travelling through ${
        trapCount === 1
          ? 'a single trap'
          : `${trapCount}&nbsp;traps`
      }, `
    } else if (monsterValues.mt === 1) {
      if (paths[0][paths[0].length - 1].isTrap) {
        focus.traps = 1
        message += `By jumping to a trap `
      }
    }
  }

  if (focus.verbose) {
    message += `I have path to <a href="#" id="fih">${
      paths.length === 1
        ? 'a single hex'
        : `${paths.length}&nbsp;hexes`
    }</a> where I could make an attack.`

    focus.messages.push(message)
  }

  if (paths.length > 1) {
    const shortestDistance = paths.reduce(((previousValue, currentPathArray) => (
      !previousValue || currentPathArray.pathLength < previousValue
        ? currentPathArray.pathLength
        : previousValue
    )), false)

    const allPathsLength = paths.length
    const shortestPaths = paths.filter(p => p.pathLength === shortestDistance)
    paths.length = 0
    paths.push(...shortestPaths)

    if (focus.verbose === 2) {
      board.focusInfo.paths = paths
      board.focusInfo.pathStart = monster.ch
    }

    if (focus.verbose) {
      if (allPathsLength === paths.length) {
        focus.messages.push(
          `<a href="#" id="fip">${
            allPathsLength === 2
              ? 'Both'
              : 'All'
          } of these paths</a> would take the same amount of movement points.`
        )
      } else {
        focus.messages.push(
          `<a href="#" id="fip">The shortest ${
            paths.length === 1
              ? 'path'
              : `${paths.length} paths`
          }</a> would require ${shortestDistance}&nbsp;movement point${
            shortestDistance > 1 ? 's' : ''
          }.`
        )
      }
    }
  }
}

export const checkTargetsFromPaths = (monster, focus, paths, proximities) => {
  let pathTargets = new Set()
  paths.forEach(path => {
    path.targets.forEach(pathTarget => pathTargets.add(pathTarget))
  })

  if (pathTargets.size === 1) {
    focus.player = paths[0].targets[0]
    if (focus.verbose) {
      focus.messages.push(`The focus is the ${playerNames[focus.player.color]}.`)
    }
    return
  }

  if (focus.verbose) {
    focus.messages.push(`${
      paths.length === 1
        ? 'This path'
        : 'These paths'
    } takes me ${
      monsterValues.range ? 'within range' : ''
    } to the ${joinAsNames([...pathTargets])}.`)
  }

  let shortestProxPath = 999

  pathTargets.forEach(pathTarget => {
    let proxPath = getPath(monster.ch, pathTarget.ch, [], 2)
    proximities.push({
      distance: proxPath.length,
      target: pathTarget
    })

    if (proxPath.length < shortestProxPath) {
      shortestProxPath = proxPath.length
    }
  })

  const proximitiesBefore = proximities.length
  const shortestProximities = proximities.filter(p => p.distance === shortestProxPath)

  proximities.length = 0
  proximities.push(...shortestProximities)

  if (proximities.length === 1) {
    focus.player = proximities[0].target
    if (focus.verbose) {
      focus.messages.push(`The focus is the ${
        playerNames[focus.player.color]
      } because ${
        genders[focus.player.color]
      } is the closest target.`)
    }
    return
  }

  if (focus.verbose) {
    focus.messages.push(`${
      proximities.length === proximitiesBefore
        ? proximitiesBefore === 2
        ? 'Both'
        : 'All'
        : proximities.length
    } of them are equally close in proximity from my current position.`)
  }
}
