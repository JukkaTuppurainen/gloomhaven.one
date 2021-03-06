import {deleteBoardCache}           from './monsters.focus.functions'
import {checkTargetsAlreadyInRange} from './monsters.focus.step1'
import {getPathsToAttack}           from './monsters.focus.step2'
import {
  filterInShortestPaths,
  checkTargetsFromPaths
}                                   from './monsters.focus.step3'
import {checkInitiatives}           from './monsters.focus.step4'
import {board}                      from '../../board/board'


export const findFocus = (monster, fromTargets, verbose = 0) => {
  const focus = {
    messages: [],
    player: undefined,
    traps: 0,
    verbose
  }

  if (verbose === 2) {
    board.focusInfo = {
      focusHexes: [],
      focusHexesVisible: false,
      paths: false,
      pathsVisible: false,
      pathStart: monster.ch
    }
  }

  const targets = fromTargets || board.items.filter(item => item.type === 'player')

  if (board.cacheInvalid === true) {
    deleteBoardCache()
    board.cacheInvalid = false
  }

  /*
   * # FOCUS SELECTION STEP 1
   *   - Are some targets already in the range?
   */

  checkTargetsAlreadyInRange(monster, focus, targets)
  if (focus.player || focus.ambiguous) {
    return focus
  }

  /*
   * There was no targets already in range.
   *
   * # FOCUS SELECTION STEP 2
   *   - Find paths to hexes where an attack is possible.
   */

  let paths = []

  getPathsToAttack(monster, focus, paths, targets)
  if (focus.player === false) {
    // If focus.player is set to false, there is not a single path to target available.
    return focus
  }

  /*
   * There is valid path(s) to target(s)
   *
   * # FOCUS SELECTION STEP 3
   *   - Take the shortest path and if required, check physical distances.
   */

  filterInShortestPaths(monster, focus, paths, targets)

  let proximities = []

  checkTargetsFromPaths(monster, focus, paths, proximities)
  if (focus.player) {
    return focus
  }

  /*
   * # FOCUS SELECTION STEP 4
   *   - Initiative check
   */

  checkInitiatives(focus, proximities)

  return focus
}
