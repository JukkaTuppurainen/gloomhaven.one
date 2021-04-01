import {board}           from '../../src/board/board'
import {isInSight}       from '../../src/lib/isInSight.js'
import {initGlobalMocks} from '../mocks/globals'


initGlobalMocks()

const scenariosLineOfSightInfo = {
  1: [3788, 3352],
  2: [4710, 3300],
  3: [11802, 10548],
  4: [3646, 5284],
  5: [5002, 4700],
  6: [7546, 10010],
  7: [6156, 11136],
  8: [3564, 2916],
  9: [4846, 1796],
  10: [6352, 5858],
  27: [1190, 0]
}

const scenariosToTest = Object.keys(scenariosLineOfSightInfo)

let hexLOSdata

const testScenarioFullLOS = () => {
  let inSight = 0
  let outOfSight = 0
  const hexesToTest = board.scenario.hexes

  hexesToTest.forEach(hex => {
    const losData = []
    hexLOSdata.set(hex, losData)

    hexesToTest.forEach(hex2 => {
      if (hex.x !== hex2.x || hex.y !== hex2.y) {
        if (isInSight(hex, hex2)) {
          losData.push(hex2)
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

describe('Line of Sight test', () => {
  test('Performs full LOS test for list of scenarios', () => {
    expect.assertions(scenariosToTest.length * 3)

    let chain = Promise.resolve()

    for (let i of scenariosToTest) {
      chain = chain
        .then(() => board.loadScenario(i))
        .then(() => {
          hexLOSdata = new WeakMap()

          const [inSight, outOfSight] = testScenarioFullLOS()
          const [expectedInSight, expectedOutOfSight] = scenariosLineOfSightInfo[i]

          expect(inSight).toBe(expectedInSight)
          expect(outOfSight).toBe(expectedOutOfSight)

          let hexesWithOneWayLOS = 0

          board.scenario.hexes.forEach(hex => {
            hexLOSdata.get(hex).forEach(visibleHex => {
              if (!hexLOSdata.get(visibleHex).includes(hex)) {
                ++hexesWithOneWayLOS
              }
            })
          })

          expect(hexesWithOneWayLOS).toBe(0)
        })
    }

    return chain
  })
})
