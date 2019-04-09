import bitmap from './1_BlackBarrow.jpg'


export default {
  bitmap,
  bitmapScale: .928,
  blueprint: {
    hexes: 'bgcgbgcgbgimeejmambmamjmim',
    thinWalls: [
/*    x, y, side */
      7, 8, 1,
      9, 8, 1
    ]
  },
  style: {
    thinWalls: {
      line: '#000',
      width: 4
    },
    hexHover: '#32005080'
  }
}
