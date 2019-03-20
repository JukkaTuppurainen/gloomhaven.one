import bitmap from './1_BlackBarrow.jpg'


export const scenario = {
  bitmap,
  bitmapScale: .928,
  blueprint: {
    hexes: [
/*    x, y */
      0, '1-6',
      1, '1-5',
      2, '1-6',
      3, '1-5',
      4, '1-6',
      5, 3,
      4, '8-12',
      5, '8-11',
      6, '0-12',
      7, '0-11',
      8, '0-12',
      9, '8-11',
      10, '8-12'
    ],
    thinWalls: [
/*    x, y, side */
      6, 7, 1,
      8, 7, 1
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
