import {add}              from '../helpers'
import {initGlobalMocks}  from '../../mocks/globals'
import {board}            from '../../../src/board/board'
import {findFocus}        from '../../../src/monsters/focus/monsters.focus'
import {monsterValues}    from '../../../src/monsters/monsters.controls'
import {createItemToHex}  from '../../../src/monsters/monsters.functions'


initGlobalMocks()

beforeAll(() => board.loadScenario('test1'))
beforeEach(() => {
  board.items.length = 0
  monsterValues.mt = 0
})

describe('Monster focus', () => {
  // Test image: test-map-1-1.png
  it('uses the shortest path to enemy', () => {
    const player = createItemToHex({x: 3, y: 1}, 'player')
    const player2 = createItemToHex({x: 2, y: 4}, 'player')
    const monster = createItemToHex({x: 1, y: 1}, 'monster')

    board.items.push(monster, player, player2)

    const f = findFocus(monster)
    expect(f.player).toBe(player)
  })

  // Test image: test-map-1-2.png
  it('fails when there is no hexes to attack from', () => {
    const player = createItemToHex({x: 1, y: 1}, 'player')
    const monster = createItemToHex({x: 4, y: 4}, 'monster')
    add.monsters({x: 1, y: 2}, {x: 2, y: 2})

    board.items.push(player, monster)

    const f = findFocus(monster)
    expect(f.player).toBe(false)
  })

  // Test image: test-map-1-3.png
  it('selects physically closest target when path lengths are same, initiatives ignored', () => {
    const monster = createItemToHex({x: 3, y: 2}, 'monster')
    add.monsters({x: 2, y: 2})
    const player = createItemToHex({x: 1, y: 1}, 'player')
    const player2 = createItemToHex({x: 6, y: 2}, 'player')

    player.initiative = 50
    player2.initiative = 1

    board.items.push(player, player2, monster)

    const f = findFocus(monster)
    expect(f.player).toBe(player)
  })

  // Test image: test-map-1-4.png
  it('uses initiative as the last tie breaker', () => {
    const monster = createItemToHex({x: 4, y: 4}, 'monster')
    const player = createItemToHex({x: 2, y: 3}, 'player')
    const player2 = createItemToHex({x: 6, y: 3}, 'player')

    player.initiative = 1
    player2.initiative = 2

    board.items.push(player, player2, monster)

    const f = findFocus(monster)
    expect(f.player).toBe(player)
  })

  // Test image: test-map-1-5.png
  it('works through allies', () => {
    const player = createItemToHex({x: 1, y: 2}, 'player')
    const monster = createItemToHex({x: 3, y: 3}, 'monster')
    add.monsters(
      {x: 1, y: 3},
      {x: 2, y: 2},
      {x: 2, y: 3}
    )

    board.items.push(player, monster)

    const f = findFocus(monster)
    expect(f.player).toStrictEqual(player)
  })

  // Test image: test-map-1-6.png
  it('is blocked by enemies', () => {
    const monster = createItemToHex({x: 3, y: 4}, 'monster')
    add.monsters(
      {x: 1, y: 3},
      {x: 2, y: 3},
      {x: 3, y: 1},
      {x: 3, y: 2}
    )
    const player = createItemToHex({x: 1, y: 2}, 'player')
    const player2 = createItemToHex({x: 2, y: 2}, 'player')

    board.items.push(player, player2, monster)

    const f = findFocus(monster)
    expect(f.player).toBe(false)
  })

  // Test image: test-map-1-6.png
  it('works through enemies for jumping and flying monsters', () => {
    const monster = createItemToHex({x: 3, y: 4}, 'monster')
    add.monsters(
      {x: 1, y: 3},
      {x: 2, y: 3},
      {x: 3, y: 1},
      {x: 3, y: 2}
    )
    const player = createItemToHex({x: 1, y: 2}, 'player')
    const player2 = createItemToHex({x: 2, y: 2}, 'player')

    player.initiative = 1
    player2.initiative = 2

    board.items.push(player, player2, monster)

    monsterValues.mt = 1

    const f = findFocus(monster)
    expect(f.player).toBe(player)

    monsterValues.mt = 2

    const f2 = findFocus(monster)
    expect(f2.player).toBe(player)
  })

  // Test image: test-map-1-7.png
  it('is blocked by obstacles', () => {
    const monster = createItemToHex({x: 5, y: 2}, 'monster')
    const player = createItemToHex({x: 1, y: 2}, 'player')

    board.items.push(monster, player)

    add.obstacles(
      {x: 1, y: 4},
      {x: 2, y: 4},
      {x: 3, y: 1},
      {x: 3, y: 2},
      {x: 3, y: 3}
    )

    const f = findFocus(monster)
    expect(f.player).toBe(false)
  })

  // Test image: test-map-1-7.png
  it('is not blocked by obstacles for jumping and flying monsters', () => {
    const monster = createItemToHex({x: 5, y: 2}, 'monster')
    const player = createItemToHex({x: 1, y: 2}, 'player')

    board.items.push(monster, player)

    add.obstacles(
      {x: 1, y: 4},
      {x: 2, y: 4},
      {x: 3, y: 1},
      {x: 3, y: 2},
      {x: 3, y: 3}
    )

    monsterValues.mt = 1

    const f = findFocus(monster)
    expect(f.player).toBe(player)

    monsterValues.mt = 2

    const f2 = findFocus(monster)
    expect(f2.player).toBe(player)
  })

  // Test image: test-map-1-7.png
  it('works over obstacles for monster with long enough ranged attack', () => {
    const monster = createItemToHex({x: 5, y: 2}, 'monster')
    const player = createItemToHex({x: 1, y: 2}, 'player')

    board.items.push(monster, player)

    add.obstacles(
      {x: 1, y: 4},
      {x: 2, y: 4},
      {x: 3, y: 1},
      {x: 3, y: 2},
      {x: 3, y: 3}
    )

    monsterValues.range = 3

    const f = findFocus(monster)
    expect(f.player).toBe(player)
  })

  // Test image: test-map-1-7.png
  it('fails over obstacles for monster with too short ranged attack', () => {
    const monster = createItemToHex({x: 5, y: 2}, 'monster')
    const player = createItemToHex({x: 1, y: 2}, 'player')

    board.items.push(monster, player)

    add.obstacles(
      {x: 1, y: 4},
      {x: 2, y: 4},
      {x: 3, y: 1},
      {x: 3, y: 2},
      {x: 3, y: 3}
    )

    monsterValues.range = 2

    const f = findFocus(monster)
    expect(f.player).toBe(false)
  })
})
