import {countTrapsInPath} from '../focus/monsters.focus.functions'
import {monsterValues}    from '../monsters.controls'
import {board}            from '../../board/board'
import {getPath}          from '../../lib/getPath'
import {isAdjacent}       from '../../lib/hexUtils'
import {isInSight}        from '../../lib/isInSight'


export const resolveBestPath = (movementTargets, focus) => {
  /*
   * ## MOVEMENT RESOLVE STEP 2.1
   *   - Get hexes where attack against the focus is eventually possible from focus info.
   */

  const attackHexes = board.focusInfo.focusHexes.filter(h =>
    h.targets.includes(focus.player)
  )

  let pathsToAttackHexes
  let shortestPath

  const pathingBlockingItems = monsterValues.mt === 0
    ? ['obstacle']
    : []

  /*
   * ## MOVEMENT RESOLVE STEP 2.2
   *   - Get path from every movement target to every single possible attack hex.
   *   - Use the shortest path to determine how much distance there is left to the attack hex.
   *   - Also count the total traps in path to movement target and from there to the attack hex.
   */

  movementTargets.forEach(movementTarget => {
    pathsToAttackHexes = []
    attackHexes.forEach(hex => {
      pathsToAttackHexes.push(
        getPath(movementTarget, hex, pathingBlockingItems, monsterValues.mt)
      )
    })

    shortestPath = pathsToAttackHexes.reduce((previousValue, currentValue) =>
      previousValue === false || currentValue.pathLength < previousValue.pathLength
        ? currentValue
        : previousValue
    , false)

    movementTarget.distance = shortestPath.pathLength || 0
    movementTarget.endPath = shortestPath
    movementTarget.totalTraps =
      countTrapsInPath(movementTarget.path) +
      (
        (shortestPath && countTrapsInPath(shortestPath)) || 0
      )
  })

  /*
   * ## MOVEMENT RESOLVE STEP 2.3
   *   - Filter out movement targets where the total trap count is too high.
   */

  if (monsterValues.mt === 0) {
    movementTargets = movementTargets.filter(movementTarget =>
      movementTarget.totalTraps <= focus.traps
    )
  }

  /*
   * ## MOVEMENT RESOLVE STEP 2.4
   *   - Resolve the smallest distance to target.
   *   - Filter out any movement targets where the distance is greater than that.
   */

  let smallestDistance = movementTargets.reduce((previousValue, currentValue) =>
    currentValue.distance < previousValue
      ? currentValue.distance
      : previousValue
  , 999)

  movementTargets = movementTargets.filter(movementTarget =>
    movementTarget.distance === smallestDistance
  )

  /*
   * ## MOVEMENT RESOLVE STEP 2.5
   *   - If doing ranged attack, check for disadvantage and possibility to avoid it
   */

  if (smallestDistance === 0 && monsterValues.range) {
    let withDisadvantage = 0
    let withoutDisadvantage = 0

    movementTargets = movementTargets.filter(mt => {
      if (
        !isInSight(mt, focus.player.ch) ||
        getPath(mt, focus.player.ch, [], 2).length > monsterValues.range
      ) {
        return false
      }

      mt.a = isAdjacent(mt, focus.player.ch)

      if (mt.a) {
        ++withDisadvantage
      } else {
        ++withoutDisadvantage
      }

      return true
    })

    if (withoutDisadvantage && withDisadvantage && monsterValues.range > 1) {
      let shortest = movementTargets.reduce((previousValue, currentValue) =>
        previousValue === false || currentValue.path.length < previousValue
          ? currentValue.path.length
          : previousValue
      , false)

      movementTargets = movementTargets.filter(mt => !mt.a)

      let nextShortest = movementTargets.reduce((previousValue, currentValue) =>
        previousValue === false || currentValue.path.length < previousValue
          ? currentValue.path.length
          : previousValue
      , false)

      if (nextShortest > shortest) {
        focus.disadvantage = 2 // avoided
      }
    }

    if (!withoutDisadvantage && withDisadvantage) {
      focus.disadvantage = 1 // can't avoid
    }
  }

  /*
   * ## MOVEMENT RESOLVE STEP 2.6
   *   - Resolve the least number of hexes to move and filter the movement targets.
   */

  let leastSteps = movementTargets.reduce((previousValue, currentValue) =>
    currentValue.path.length < previousValue
      ? currentValue.path.length
      : previousValue
  , 999)

  movementTargets = movementTargets.filter(movementTarget =>
    movementTarget.path.length === leastSteps
  )

  return movementTargets
}
