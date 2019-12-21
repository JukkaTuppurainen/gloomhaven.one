import {joinAsNames} from './monsters.focus.functions'
import {playerNames} from '../monsters.items'


export const checkInitiatives = (focus, proximities) => {
  let lowestInitiative = 999

  proximities.forEach(p => {
    if (p.target.initiative < lowestInitiative) {
      lowestInitiative = p.target.initiative
    }
  })

  proximities = proximities.filter(p => p.target.initiative === lowestInitiative)

  if (proximities.length === 1) {
    focus.player = proximities[0].target
    if (focus.verbose) {
      focus.messages.push(
        `The focus is the ${playerNames[focus.player.color]} due to the lowest initiative.`
      )
    }
    return focus
  }

  if (focus.verbose) {
    focus.messages.push(`The focus is tied between the ${
      joinAsNames(proximities.map(p => p.target))
    }.`)
  }
}
