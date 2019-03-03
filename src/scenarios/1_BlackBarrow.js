import bitmap from './1_BlackBarrow.jpg'


export const scenario = {
  bitmap,
  bitmapScale: .928,
  blueprint: {
    hexes: [
      {x: 0, y: '1-6'},
      {x: 1, y: '1-5'},
      {x: 2, y: '1-6'},
      {x: 3, y: '1-5'},
      {x: 4, y: '1-6'},
      {x: 5, y: 3},
      {x: 4, y: '8-12'},
      {x: 5, y: '8-11'},
      {x: 6, y: '0-12'},
      {x: 7, y: '0-11'},
      {x: 8, y: '0-12'},
      {x: 9, y: '8-11'},
      {x: 10, y: '8-12'}
    ],
    wallHexes: [
      {x: '0-4', y: 0},
      {x: 5, y: '0-2'},
      {x: 5, y: '4-7'},
      {x: 0, y: 7},
      {x: 1, y: 6},
      {x: 2, y: 7},
      {x: 3, y: '6-12'},
      {x: 4, y: 7},
      {x: 9, y: '0-7'},
      {x: 10, y: 7},
    ],
    thinWalls: [
      [{x: 6, y: 8}, 4, {x: 6, y: 8}, 5],
      [{x: 8, y: 8}, 4, {x: 8, y: 8}, 5]
    ]
  },
  grid: {
    height: 13,
    width: 11
  },
  style: {
    thinWalls: {
      line: '#000',
      width: 4
    },
    hexHover: '#32005080'
  }
}
