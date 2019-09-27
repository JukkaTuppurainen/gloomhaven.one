export const flagFloor  = 1
export const flagRoom   = 2
export const flagFlying = 4

export const itemsList = {
  obstacle: {
    name: 'Obstacle',
    stacks: flagFloor | flagRoom
  },
  player: {
    name: 'Player character',
    stacks: flagRoom | flagFlying
  },
  difficult: {
    name: 'Difficult terrain',
    stacks: flagFloor
  },
  monster: {
    name: 'Monster',
    stacks: flagRoom | flagFlying
  },
  trap: {
    name: 'Trap',
    stacks: flagFloor
  }
}

export const playerNames = {
  0: 'Brute',
  1: 'Scoundrel',
  2: 'Spellweaver',
  3: 'Cragheart',
  4: 'Mindthief',
  5: 'Tinkerer'
}

export const genders = {
  0: 'he',
  1: 'she',
  2: 'she',
  3: 'he',
  4: 'he',
  5: 'he',
}
