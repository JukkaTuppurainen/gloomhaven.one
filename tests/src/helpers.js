import {board}            from '../../src/board/board'
import {createItemToHex}  from '../../src/monsters/monsters.functions'


export const add = new class {
  add(hexes, what) {
    hexes.forEach(hex => {
      board.items.push(
        createItemToHex(hex, what)
      )
    })
  }

  monsters(...hexes) {
    this.add(hexes, 'monster')
  }

  obstacles(...hexes) {
    this.add(hexes, 'obstacle')
  }
}()
