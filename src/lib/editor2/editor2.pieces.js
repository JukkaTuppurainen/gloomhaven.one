import bitmap_I1b  from '../../scenarios/I1b.webp'
import bitmap_L1a  from '../../scenarios/L1a.webp'
import bitmap_G1b  from '../../scenarios/G1b.webp'
import bitmap_door from '../../scenarios/door.webp'


export const pieceList = {
  door: {
    bitmap: bitmap_door,
    blueprints: {
      0: 'aa'
    },
    styles: {
      180: {
        left: 0,
        top: 0
      }
    },
    symmetrical: true
  },
  I1b: {
    bitmap: bitmap_I1b,
    blueprints: {
      0: 'afaeafaeaf.1ae1f3ae3f5ae5f',
      60: 'ddcecgbfbfaecedd.1dc2ec3gc6af7cf8df',
      120: 'ddbdaeaebfbfcecc.1dd2bd3ad6fa7ea8ca'
    },
    styles: {
      60: {
        left: 76,
        top: 47
      },
      120: {
        left: 75,
        top: -5
      }
    },
    symmetrical: true
  },
  L1a: {
    bitmap: bitmap_L1a,
    blueprints: {
      0: 'aeadaeadaeadae.1ae1e3ae3e5ae5e7ae7e'
    },
    symmetrical: true
  },
  G1b: {
    bitmap: bitmap_G1b,
    blueprints: {
      0: 'ahagah.1ae1h3ae3h'
    },
    symmetrical: true
  }
}
