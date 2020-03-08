import {board}           from '../../../src/board/board'
import {initGlobalMocks} from '../../mocks/globals'


initGlobalMocks()

describe('Board global object', () => {
  describe('loadScenario()', () => {
    test('loads The Black Barrow', () => {
      expect.assertions(1)
      return board.loadScenario(1)
        .then(() => {
          expect(board.scenario.hexes).toHaveLength(85)
        })
    })

    test('loads custom test map', () => {
      expect.assertions(1)
      return board.loadScenario('test1')
        .then(() => {
          expect(board.scenario.hexes).toHaveLength(53)
        })
    })
  })
})
