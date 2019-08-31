import {joinAsNames}    from './monsters.focus.functions'
import {monsterValues}  from '../monsters.controls'
import {
  genders,
  playerNames
}                       from '../monsters.items'
import {board}          from '../../board/board'
import {getPath}        from '../../lib/getPath'


export const filterInShortestPaths = (monster, focus, paths) => {
  focus.messages.push(`I have path to <a href="#" id="fih">${
    paths.length === 1
      ? 'a single hex'
      : `${paths.length} hexes`
  }</a> where I could make an attack.`)

  if (paths.length > 1) {
    const shortestDistance = paths.reduce(((previousValue, currentPathArray) => (
      !previousValue || currentPathArray.pathLength < previousValue
        ? currentPathArray.pathLength
        : previousValue
    )), false)

    const allPathsLengt = paths.length
    const shortestPaths = paths.filter(p => p.pathLength === shortestDistance)
    paths.length = 0
    paths.push(...shortestPaths)

    board.focusInfo.paths = paths
    board.focusInfo.pathStart = monster.ch

    if (allPathsLengt === paths.length) {
      focus.messages.push(
        '<a href="#" id="fip">All of these paths</a> takes the same amount of movement points.'
      )
    } else {
      focus.messages.push(
        `<a href="#" id="fip">The shortest ${
          paths.length === 1
            ? 'path'
            : `${paths.length} paths`
        }</a> requires ${shortestDistance}&nbsp;movement point${
          shortestDistance > 1 ? 's' : ''
        }.`
      )
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
    focus.messages.push(`The focus is the ${playerNames[focus.player.color]}.`)
    return
  }

  focus.messages.push(`${
    paths.length === 1
      ? 'This path'
      : 'These paths'
  } takes me ${
    monsterValues.range ? 'within range' : ''
  } to the ${joinAsNames([...pathTargets])}.`)

  let shortestProxPath = 999

  pathTargets.forEach(pathTarget => {
    let proxPath = getPath(monster.ch, pathTarget.ch)
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

  // proximities = proximities.filter(p => p.distance === shortestProxPath)
  proximities.length = 0
  proximities.push(...shortestProximities)

  if (proximities.length === 1) {
    focus.player = proximities[0].target
    focus.messages.push(`The focus is the ${
      playerNames[focus.player.color]
    } because ${
      genders[focus.player.color]
    } is the closest target.`)
    return
  }

  focus.messages.push(`${
    proximities.length === proximitiesBefore
      ? proximitiesBefore === 2
        ? 'Both'
        : 'All'
      : proximities.length
  } of them are at equally close in proximity.`)
}
