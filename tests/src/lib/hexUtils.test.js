import {
  neighborsOf,
  pointToHex,
  rectangle
} from '../../../src/lib/hexUtils'


describe('neighborsOf()', () => {
  const gridSize1 = {
    height: 12,
    width: 24
  }
  test('Returns correct neighbors', () => {
    expect(neighborsOf({x: 0, y: 0}, gridSize1)).toStrictEqual([
      {x: 1, y: 0},
      {x: 0, y: 1},
      null, null, null, null
    ])

    expect(neighborsOf({x: 2, y: 2}, gridSize1)).toStrictEqual([
      {x: 3, y: 2},
      {x: 2, y: 3},
      {x: 1, y: 2},
      {x: 1, y: 1},
      {x: 2, y: 1},
      {x: 3, y: 1}
    ])

    expect(neighborsOf({x: 21, y: 0}, gridSize1)).toStrictEqual([
      {x: 22, y: 1},
      {x: 21, y: 1},
      {x: 20, y: 1},
      {x: 20, y: 0},
      null,
      {x: 22, y: 0}
    ])

    expect(neighborsOf({x: 22, y: 0}, gridSize1)).toStrictEqual([
      {x: 23, y: 0},
      {x: 22, y: 1},
      {x: 21, y: 0},
      null, null, null
    ])

    expect(neighborsOf({x: 23, y: 0}, gridSize1)).toStrictEqual([
      null,
      {x: 23, y: 1},
      {x: 22, y: 1},
      {x: 22, y: 0},
      null, null
    ])

    expect(neighborsOf({x: 22, y: 11}, gridSize1)).toStrictEqual([
      {x: 23, y: 11},
      null,
      {x: 21, y: 11},
      {x: 21, y: 10},
      {x: 22, y: 10},
      {x: 23, y: 10},
    ])
  })

  const gridSize2 = {
    height: 12,
    width: 23
  }

  test('Returns correct neighbors with different size grid', () => {
    expect(neighborsOf({x: 22, y: 0}, gridSize2)).toStrictEqual([
      null,
      {x: 22, y: 1},
      {x: 21, y: 0},
      null, null, null
    ])

    expect(neighborsOf({x: 22, y: 11}, gridSize2)).toStrictEqual([
      null,
      null,
      {x: 21, y: 11},
      {x: 21, y: 10},
      {x: 22, y: 10},
      null
    ])
  })
})

describe('pointToHex()', () => {
  // Test image: hexUtils.test.pointToHex.png
  test('Returns correct value with all test coordinates', () => {
    expect(pointToHex(46, 40)).toStrictEqual({x: 0, y: 0})
    expect(pointToHex(142, 90)).toStrictEqual({x: 1, y: 0})
    expect(pointToHex(152, 104)).toStrictEqual({x: 2, y: 1})
    expect(pointToHex(217, 167)).toStrictEqual({x: 3, y: 1})
    expect(pointToHex(210, 179)).toStrictEqual({x: 2, y: 2})
    expect(pointToHex(248, 268)).toStrictEqual({x: 3, y: 2})
    expect(pointToHex(315, 242)).toStrictEqual({x: 4, y: 3})
  })
})

describe('rectangle()', () => {
  test('Returns rectangle board of hexes', () => {
    const r = rectangle({
      height: 20,
      width: 20
    })

    expect(r[0]).toStrictEqual({x: 0, y: 0})
    expect(r[50]).toStrictEqual({x: 2, y: 10})
    expect(r.length).toBe(20 * 20)
  })
})


