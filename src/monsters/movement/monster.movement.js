import {getPossibleMovementTargets} from './monster.movement.step1'
import {resolveBestPath}            from './monster.movement.step2'
import {monsterValues}              from '../monsters.controls'
import {playerNames}                from '../monsters.items'
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

  movementTargets = resolveBestPath(monster, focus, movementTargets)

  /*
   * Add to focusInfo and return result with message
   */

  const doesAttack = movementTargets.some(mt => mt.distance === 0)
  const multitarget = movementTargets.some(mt => mt.targets && mt.targets.length > 1)

  board.focusInfo.moveHexes = movementTargets
  board.focusInfo.moveHexesVisible = false

  let message

  // Does move?
  if (
    movementTargets.length > 1 || (
      movementTargets[0] &&
      movementTargets[0].path.length
    )
  ) {
    message = `I move to <a href="#" id="fim">${
      movementTargets.length === 1
        ? 'this hex'
        : 'one of these hexes'
      }</a>${focus.disadvantage === 2 && !multitarget ? ' to avoid Disadvantage' : ''}`
  } else {
    message = 'I stand here'
    if (!doesAttack) {
      message += ' since moving would not get me any closer'
    }
  }

  if (doesAttack) {
    message += ' and perform '

    if (!multitarget) {
      message += ` ${monsterValues.range ? 'a ranged' : 'an'}`
    } else if (monsterValues.range) {
      message += 'ranged'
    }

    message += ' attack'

    if (multitarget) {
      message += `s against the following targets:<ol>`
      movementTargets.info.forEach(target => {
        message += `<li>${playerNames[target.player.color]}</li>`
      })
      message += '</ol>'
    } else if (focus.disadvantage === 1) {
      message += ' with Disadvantage'
    }
  }

  if (!multitarget) {
    message += '.'
  }

  movement.messages.push(message)

  return movement
}
