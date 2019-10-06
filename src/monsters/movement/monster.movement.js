import {getPossibleMovementTargets} from './monster.movement.step1'
import {resolveBestPath}            from './monster.movement.step2'
import {monsterValues}              from '../monsters.controls'
import {board}                      from '../../board/board'


export const findMovement = (monster, focus) => {
  const movement = {
    messages: []
  }

  /*
   * # MOVEMENT RESOLVE STEP 1
   *   - Get all possible hexes where the monster could move during this turn.
   */

  let movementTargets = getPossibleMovementTargets(monster, focus)

  /*
   * # MOVEMENT RESOLVE STEP 2
   *   - Determine which movement target is the best option.
   */

  movementTargets = resolveBestPath(movementTargets, focus)

  /*
   * Add to focusInfo and return result with message
   */

  const doesAttack = movementTargets.some(movementTarget => movementTarget.distance === 0)

  board.focusInfo.moveHexes = movementTargets
  board.focusInfo.moveHexesVisible = false

  movement.messages.push(
    // Does move?
    movementTargets.length > 1 || (
      movementTargets[0] &&
      movementTargets[0].path.length
    )

      // Moves
      ? `I move to <a href="#" id="fim">${
        movementTargets.length === 1
          ? 'this hex'
          : 'one of these hexes'
      }</a>${focus.disadvantage === 2 ? ' to avoid Disadvantage' : ''}${doesAttack ? ` and perform ${
        monsterValues.range
          ? 'a ranged'
          : 'an'
      } attack${focus.disadvantage === 1 ? ' with Disadvantage' : ''}` : ''}.`

      // Doesn't move
      : doesAttack
        ? `I stand here and perform ${monsterValues.range ? 'a ranged' : 'an'} attack${
            focus.disadvantage === 1 ? ' with Disadvantage' : ''
          }.`
        : 'I stand here since moving would not get me any closer.'
  )

  return movement
}
