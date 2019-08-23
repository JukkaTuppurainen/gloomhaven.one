import {
  findTargetsInRange,
  joinAsNames
}                       from './monsters.focus.functions'
import {monsterValues}  from '../monsters.controls'
import {
  genders,
  playerNames
}                       from '../monsters.items'


export const checkTargetsAlreadyInRange = (monster, focus) => {
  const targetsInRange = findTargetsInRange(
    monster.ch,
    monsterValues.range || 1
  )

  if (targetsInRange.length === 0) {
    return
  }

  /*
   * ## FOCUS SELECTION STEP 1.1
   *   - Return if only one target in range.
   *   - Or proceed to find targets at the closest distance.
   */

  if (targetsInRange.length === 1) {
    focus.player = targetsInRange[0]
    focus.messages.push(
      `The focus is the ${
        playerNames[focus.player.color]
      } since ${genders[focus.player.color]} is the only ${
        monsterValues.range
          ? 'target already in range'
          : 'adjacent target'
      }.`
    )
    return
  }

  const initialTargetCount = targetsInRange.length

  focus.messages.push(
    `I already have ${initialTargetCount} targets in range.`
  )

  // Resolve the shortest range which has target(s)
  // Filter out all targets that are further away

  let shortestRange = targetsInRange.reduce((previousValue, currentValue) => (
    !previousValue || currentValue.r < previousValue
      ? currentValue.r
      : previousValue
  ), false)

  const targetsInShortestRange = targetsInRange.filter(
    target => target.r === shortestRange
  )

  /*
   * ## FOCUS SELECTION STEP 1.2
   *   - Return if there is only one target at the shortest range.
   *   - Or proceed to check initiatives.
   */

  if (targetsInShortestRange.length === 1) {
    focus.player = targetsInShortestRange[0]
    focus.messages.push(
      `The focus is the ${
        playerNames[focus.player.color]
      } since ${genders[focus.player.color]} is the closest target.`
    )

    return
  }

  focus.messages.push(
    targetsInShortestRange.length !== initialTargetCount
      ? `${targetsInShortestRange.length} of them are at the shortest range.`
      : `${targetsInShortestRange.length === 2
        ? 'Both'
        : 'All'
      } of them are at the same distance.`
  )

  // Resolve the lowest initiative
  // Filter out all targets that have higher initiative

  let lowestInitiative = targetsInShortestRange.reduce((previousValue, currentValue) => (
    !previousValue || currentValue.initiative < previousValue
      ? currentValue.initiative
      : previousValue
  ), false)

  const targetsWithLowestInitiative = targetsInShortestRange.filter(
    target => target.initiative === lowestInitiative
  )

  /*
   * ## FOCUS SELECTION STEP 1.3
   *   - The shortest range has multiple targets, return the one with the lowest initiative.
   *   - Or the focus is ambigious
   */

  if (targetsWithLowestInitiative.length === 1) {
    focus.player = targetsWithLowestInitiative[0]
    focus.messages.push(
      `The focus is the ${
        playerNames[focus.player.color]
      } since ${genders[focus.player.color]} has the lowest initiative.`
    )
  } else {
    focus.player = 'ambiguous'
    focus.messages.push(
      `The focus is tied between the ${
        joinAsNames(targetsWithLowestInitiative)
      } as they have the same initiative.`
    )
  }
}
