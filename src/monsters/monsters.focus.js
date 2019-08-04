import {playerNames}  from './monsters.items'
import {board}        from '../board/board'
import {
  getPath,
  realNeighbors
}                     from '../lib/getPath'
import {neighborsOf}  from '../lib/hexUtils'


export const findFocus = monster => {
  const focus = {
    messages: [],
    player: false
  }

  const adjacentHexes = neighborsOf(monster.ch, board.gridSize)
  const adjacentTargets = board.items.filter(item => (
    item.type === 'player' &&
    adjacentHexes.find(adjacentHex => (
      adjacentHex.x === item.ch.x && adjacentHex.y === item.ch.y
    ))
  ))

  if (adjacentTargets.length) {
    const playerWithSmallestInitiative = adjacentTargets.reduce((previousValue, currentValue) => (
      !previousValue || currentValue.initiative < previousValue.initiative
        ? currentValue
        : previousValue
    ), false)

    focus.player = playerWithSmallestInitiative
    focus.messages.push('The focus is ' + playerNames[playerWithSmallestInitiative.color])

    return focus
  }

  const adjacentHexesToTargets = []
  const players = board.items.filter(item => item.type === 'player')
  let paths = []

  players.forEach(player => {
    const playerNeighbors = realNeighbors(player.ch, ['obstacle', 'monster', 'player'])
    playerNeighbors.forEach(playerNeighbor => {
      const alreadyTargetHex = adjacentHexesToTargets.find(a =>
        a.x === playerNeighbor.x && a.y === playerNeighbor.y
      )
      if (alreadyTargetHex) {
        alreadyTargetHex.targets.push(player)
      } else {
        playerNeighbor.targets = [player]
        adjacentHexesToTargets.push(playerNeighbor)
      }
    })
  })

  let path
  adjacentHexesToTargets.forEach(adjHex => {
    path = getPath(monster.ch, adjHex, ['obstacle', 'player'])
    if (path.length) {
      path.targets = adjHex.targets
      paths.push(path)
    }
  })

  if (!paths.length) {
    focus.messages.push('I have no focus because I do not have a single path to any target.')
    return focus
  }

  focus.messages.push(`I have path to ${
    paths.length === 1
      ? 'a single hex'
      : `${paths.length} hexes`
  } where I could make an attack.`)

  if (paths.length > 1) {
    const shortestDistance = paths.reduce(((previousValue, currentPathArray) => (
      !previousValue || currentPathArray.pathLength < previousValue
        ? currentPathArray.pathLength
        : previousValue
    )), false)

    const allPathsLengt = paths.length

    paths = paths.filter(p => p.pathLength === shortestDistance)

    if (allPathsLengt === paths.length) {
      focus.messages.push('All of these paths takes same amount of movement points.')
    } else {
      focus.messages.push(`The shortest ${paths.length === 1 ? 'path' : `${paths.length} paths`} requires ${shortestDistance} movement points.`)
    }
  }

  let pathTargets = new Set()
  paths.forEach(path => {
    path.targets.forEach(pathTarget => {
      pathTargets.add(pathTarget)
    })
  })

  if (pathTargets.size === 1) {
    focus.player = paths[0].targets[0]
    focus.messages.push(`The focus is the ${playerNames[focus.player.color]}`)
    return focus
  }

  let tieTargets = new Set()
  paths.forEach(path => {
    path.targets.forEach(target => tieTargets.add(target))
  })

  let textString = `${paths.length === 1 ? 'This path' : 'These paths'} takes me to the `
  let i = 0
  tieTargets.forEach(t => {
    textString += `${playerNames[t.color]}`
    if (i < tieTargets.size - 1) {
      textString += (i < tieTargets.size - 2) ? ', ' : ' & '
    }
    ++i
  })
  focus.messages.push(textString)

  let proximities = []
  let shortestProxPath = 999

  tieTargets.forEach(tieTarget => {
    let proxPath = getPath(monster.ch, tieTarget.ch)
    proximities.push({
      distance: proxPath.length,
      target: tieTarget
    })

    if (proxPath.length < shortestProxPath) {
      shortestProxPath = proxPath.length
    }
  })

  const proximitiesBefore = proximities.length

  proximities = proximities.filter(p => p.distance === shortestProxPath)

  if (proximities.length === 1) {
    focus.player = proximities[0].target
    focus.messages.push(`The focus is the ${
      playerNames[focus.player.color]
    } because he or she is the closest target.`)
    return focus
  }

  focus.messages.push(`${
    proximities.length === proximitiesBefore
      ? proximitiesBefore === 2
        ? 'Both'
        : 'All'
      : proximities.length
  } of them are at equally close in proximity.`)

  let smallestInitiative = 999

  proximities.forEach(p => {
    if (p.target.initiative < smallestInitiative) {
      smallestInitiative = p.target.initiative
    }
  })

  proximities = proximities.filter(p => p.target.initiative === smallestInitiative)

  if (proximities.length === 1) {
    focus.player = proximities[0].target
    focus.messages.push(
     `The focus is the ${playerNames[focus.player.color]} due to the lowest initiative.`
    )
    return focus
  }

  textString = `The focus is tied between the `

  proximities.forEach((p, i) => {
    textString += `${playerNames[p.target.color]}`
    if (i < proximities.length - 1) {
      textString += (i < proximities.length - 2) ? ', ' : ' & '
    }
  })

  focus.messages.push(textString)
  return focus
}
