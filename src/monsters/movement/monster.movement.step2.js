import {countTrapsInPath} from '../focus/monsters.focus.functions'
import {board}            from '../../board/board'
import {getPath}          from '../../lib/getPath'


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
        getPath(movementTarget, hex, ['obstacle'])
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

  movementTargets = movementTargets.filter(movementTarget =>
    movementTarget.totalTraps <= focus.traps
  )

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
