import {board}           from '../../src/board/board'
import {isInSight}       from '../../src/lib/isInSight.js'
import {initGlobalMocks} from '../mocks/globals'


initGlobalMocks()

const scenariosLineOfSightInfo = {
  1: [3788, 3352],
  2: [4719, 3291],
  3: [11832, 10518],
  4: [3657, 5273],
  5: [5024, 4678],
  6: [7582, 9974],
  7: [6172, 11120],
  8: [3568, 2912],
  9: [4853, 1789],
  10: [6361, 5849],
  27: [1190, 0]
}

const testScenarioFullLOS = () => {
  let inSight = 0
  let outOfSight = 0
  const hexesToTest = board.scenario.hexes

  hexesToTest.forEach(hex => {
    hexesToTest.forEach(hex2 => {
      if (hex.x !== hex2.x || hex.y !== hex2.y) {
        if (isInSight(hex, hex2)) {
          ++inSight
        } else {
          ++outOfSight
        }
      }
    })
  })

  // console.log(`Full LOS test: In sight ${inSight} / Out of sight ${outOfSight}.`)

  return [inSight, outOfSight]
}

const scenariosToTest = [1, 2,  3, 4, 5, 6, 7, 8, 9, 10, 27]

describe('Line of Sight test', () => {
  test('Performs full LOS test for list of scenarios', () => {
    expect.assertions(scenariosToTest.length * 2)

    let chain = Promise.resolve()

    for (let i of scenariosToTest) {
      chain = chain
        .then(() => board.loadScenario(i))
        .then(() => {
          const [inSight, outOfSight] = testScenarioFullLOS()
          const [expectedInSight, expectedOutOfSight] = scenariosLineOfSightInfo[i]
          expect(inSight).toBe(expectedInSight)
          expect(outOfSight).toBe(expectedOutOfSight)
        })
    }

    return chain
  })
})
