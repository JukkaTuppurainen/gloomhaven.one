import {
  hexHeight,
  hexWidth
}                   from '../../../src/board/board.constants'
import {
  createItem,
  createItemToHex
}                   from '../../../src/monsters/monsters.functions'
import {itemsList}  from '../../../src/monsters/monsters.items'


describe('createItem()', () => {
  test('Returns an item with all basic properties', () => {
    const type = Object.keys(itemsList)[0]
    const item = createItem(hexWidth / 2, hexHeight / 2, type)

    expect(item).toHaveProperty('h', 1)
    expect(item).toHaveProperty('w', 1)
    expect(item).toHaveProperty('type', type)
    expect(typeof item.stacks).toBe('number')
    expect(typeof item.x).toBe('number')
    expect(typeof item.y).toBe('number')
    expect(item.ch).toStrictEqual({x: 0, y: 0})
    expect(item.pieceHexes).toHaveLength(1)
  })
})

describe('createItemToHex()', () => {
  test('Return item with correct ch data', () => {
    const type = Object.keys(itemsList)[0]
    const item = createItemToHex({x: 5, y: 3}, type)
    expect(item.ch).toStrictEqual({x: 5, y: 3})
  })
})
