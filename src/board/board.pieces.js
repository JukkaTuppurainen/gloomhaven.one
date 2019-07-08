import bitmap_tiles from '../assets/tiles.webp'
import bitmap_A1a from '../assets/A1a.webp'
import bitmap_A1b from '../assets/A1b.webp'
import bitmap_A2a from '../assets/A2a.webp'
import bitmap_A2b from '../assets/A2b.webp'
import bitmap_A3a from '../assets/A3a.webp'
import bitmap_A3b from '../assets/A3b.webp'
import bitmap_A4a from '../assets/A4a.webp'
import bitmap_A4b from '../assets/A4b.webp'
import bitmap_B1a from '../assets/B1a.webp'
import bitmap_B1b from '../assets/B1b.webp'
import bitmap_B2a from '../assets/B2a.webp'
import bitmap_B2b from '../assets/B2b.webp'
import bitmap_B3a from '../assets/B3a.webp'
import bitmap_B3b from '../assets/B3b.webp'
import bitmap_B4a from '../assets/B4a.webp'
import bitmap_B4b from '../assets/B4b.webp'
import bitmap_C1a from '../assets/C1a.webp'
import bitmap_C1b from '../assets/C1b.webp'
import bitmap_C2a from '../assets/C2a.webp'
import bitmap_C2b from '../assets/C2b.webp'
import bitmap_D1a from '../assets/D1a.webp'
import bitmap_D1b from '../assets/D1b.webp'
import bitmap_D2a from '../assets/D2a.webp'
import bitmap_D2b from '../assets/D2b.webp'
import bitmap_E1a from '../assets/E1a.webp'
import bitmap_E1b from '../assets/E1b.webp'
import bitmap_F1a from '../assets/F1a.webp'
import bitmap_F1b from '../assets/F1b.webp'
import bitmap_G1a from '../assets/G1a.webp'
import bitmap_G1b from '../assets/G1b.webp'
import bitmap_G2a from '../assets/G2a.webp'
import bitmap_G2b from '../assets/G2b.webp'
import bitmap_H1a from '../assets/H1a.webp'
import bitmap_H1b from '../assets/H1b.webp'
import bitmap_H2a from '../assets/H2a.webp'
import bitmap_H2b from '../assets/H2b.webp'
import bitmap_H3a from '../assets/H3a.webp'
import bitmap_H3b from '../assets/H3b.webp'
import bitmap_I1a from '../assets/I1a.webp'
import bitmap_I1b from '../assets/I1b.webp'
import bitmap_I2a from '../assets/I2a.webp'
import bitmap_I2b from '../assets/I2b.webp'
import bitmap_J1a from '../assets/J1a.webp'
import bitmap_J1b from '../assets/J1b.webp'
import bitmap_J2a from '../assets/J2a.webp'
import bitmap_J2b from '../assets/J2b.webp'
import bitmap_K1a from '../assets/K1a.webp'
import bitmap_K1b from '../assets/K1b.webp'
import bitmap_K2a from '../assets/K2a.webp'
import bitmap_K2b from '../assets/K2b.webp'
import bitmap_L1a from '../assets/L1a.webp'
import bitmap_L1b from '../assets/L1b.webp'
import bitmap_L2a from '../assets/L2a.webp'
import bitmap_L2b from '../assets/L2b.webp'
import bitmap_L3a from '../assets/L3a.webp'
import bitmap_L3b from '../assets/L3b.webp'
import bitmap_M1a from '../assets/M1a.webp'
import bitmap_M1b from '../assets/M1b.webp'
import bitmap_N1a from '../assets/N1a.webp'
import bitmap_N1b from '../assets/N1b.webp'


const blueprints_A = {
  0: 'beae.2ae2e',
  60: 'cdbcbcabbb.1dc5bf',
  120: 'bbabbcbccd.1bd5da',
  180: 'aead.1ae1e',
  240: 'ccbcbcabab.1cc5af',
  300: 'ababbcbccc.1ad5ca'
}

const styles_A = {
  0: {top: 28},
  60: {left: 62, top: -62},
  120: {left: 106, top: -62},
  240: {left: 106, top: -89},
  300: {left: 63, top: -89}
}

const blueprints_B = {
  0: 'adacadac.1ae1d3ae3d',
  60: 'ccbdbeadcd.1cc2dc4af5cf',
  120: 'cdadbebdcc.1cd2ad4da5ca',
  180: 'bdadbdad.2ae2d4ae4d',
  240: 'bcadadaccc.1cc2dc4af5cf',
  300: 'ccacadadbc.1cd2ad4da5ca'
}

const styles_B = {
  0: {left: -53, top: -23},
  60: {left: 17, top: 68},
  120: {left: -29, top: 68},
  180: {top: 30},
  240: {left: -29, top: -9},
  300: {left: 16, top: -9}
}

const blueprints_C = {
  0: 'bcacadac',
  60: 'bdadbdbc',
  120: 'bcacadac',
  180: 'bdadbdbc',
  240: 'bcacadac',
  300: 'bdadbdbc'
}

const styles_C = {
  0: {left: -48, top: -54},
  60: {left: -72, top: -14},
  120: {left: -27, top: -65},
  180: {top: 0},
  240: {left: -27,top: -41},
  300: {left: -71,top: 11}
}

const blueprints_D = {
  0: 'bdadaeadbd',
  60: 'bdadaeadbd',
  120: 'bdadaeadbd'
}

const styles_D = {
  0: {left: -52, top: -57},
  60: {left: -50, top: -55},
  120: {left: -50, top: -54},
  180: {left: -52, top: -54},
  240: {left: -53, top: -55},
  300: {left: -52, top: -57}
}

const blueprints_E = {
  0: 'beaebeaebe.2ae2e4ae4e',
  60: 'cdbebfaebecd.1dc2ec5bf6cf',
  120: 'cdadaeaebebc.1cd2ad5ea6ca'
}

const styles_E = {
  0: {left: -49, top: 29},
  60: {left: -5, top: 56},
  120: {left: -5, top: 5},
  180: {left: -52, top: 32}
}

const blueprints_F = {
  0: 'acabacabacabacabac.1ae1c3ae3c5ae5c7ae7c9ae9c',
  60: 'bbacaebfdheggg.1bc2cc3af3ec4bf4fc5df5hc6ef7gf',
  120: 'ggegdhbfaeacbb.1gd2ed3dd3ha4bd4fa5ad5ea6ca7ba'
}

const styles_F = {
  0: {left: -32, top: -3},
  60: {left: -131, top: 251},
  120: {left: -130, top: 242},
  180: {left: -32, top: -23},
  240: {left: -113, top: 243},
  300: {left: -115, top: 252}
}

const blueprints_G = {
  0: 'ahagah.1ae1h3ae3h',
  60: 'eedfdfcecebdbdaccc.1ec2fc8af9cf',
  120: 'ccacbdbdcecedfdfee.1cd2ad8fa9ea',
}

const styles_G = {
  60: {left: 219, top: -76},
  120: {left: 219, top: -76},
}

const blueprints_H = {
  0: 'bgagdecedecede.2ae2g4ce4e6ce6e',
  60: 'decdcdbebgabdgbbfg.1ec4ec5gc6df7bf7ff',
  120: 'bbfgabdgbgbecdcdde.1bd1fd2dd3ga4ea7ea',
  180: 'decedecedeagbg.2ce2e4ce4e6ae6g',
  240: 'bcggadfgbgcfefdede.1cc1gc2dc3bf4cf7df',
  300: 'dedeefcfbgadfgbcgg.1dd4cd5bd6da7ca7ga'
}

const styles_H = {
  0: {top: 27},
  60: {left: 40, top: 80},
  120: {left: -140, top: 79},
  180: {top: 27},
  240: {left: -139, top: -25},
  300: {left: 41, top: -24}
}

const blueprints_I = {
  0: 'afaeafaeaf.1ae1f3ae3f5ae5f',
  60: 'ddcecgbfbfaecedd.1dc2ec3gc6af7cf8df',
  120: 'ddbdaeaebfbfcecc.1dd2bd3ad6fa7ea8ca'
}

const styles_I = {
  0: {left: -51, top: -22},
  60: {left: 84, top: 55},
  120: {left: 82, top: 3},
  180: {left: -53, top: -23}
}

const blueprints_Ja = {
  0: 'aeafagegfhfhgg.1ae1ec2fc3ae6ha7ga',
  60: 'eichcibdbdaccc.1ed1i2cd3i6af7cf',
  120: 'ccbdbdacacabacacbdbdcc.1cc2dc5ae7ae10da11ca',
  180: 'ccacbdbdcichei.1cd2ad5i6cf7ef7i',
  240: 'ggfhfhegagafae.1gc2hc5ae6fa7ae7ea',
  300: 'ccacbdbdcecdcebdbdaccc.1cd2ad5e7e10af11cf'
}

const styles_Ja = {
  60: {left: -84, top: 51},
  120: {left: 107, top: -200},
  180: {left: -32, top: -3},
  240: {left: 0, top: -79},
  300: {left: 170, top: -244}
}

const blueprints_Jb = {
  0: 'ggfhfhegagafae.1gc2hc5ae6fa7ae7ea',
  60: 'ccacbdbdcecdcebdbdaccc.1cd2ad5e7e10af11cf',
  120: 'aeafagegfhfhgg.1ae1ec2fc3ae6ha7ga',
  180: 'eichcibdbdaccc.1ed1i2cd3i6af7cf',
  240: 'ccbdbdacacabacacbdbdcc.1cc2dc5ae7ae10da11ca',
  300: 'ccacbdbdcichei.1cd2ad5i6cf7ef7i'
}

const styles_Jb = {
  0: {left: -33},
  60: {left: 107, top: -245},
  120: {left: -84, top: -80},
  180: {left: -53, top: -5},
  240: {left: 172, top: -200},
  300: {left: 0, top: 50}
}

const blueprints_K = {
  0: 'cfbfbgacegacfhabfg',
  60: 'cgbgbgacbdbdcecd',
  120: 'cdbdbdacacafbgbf',
  180: 'bcghacfhbdfhbgcgcf',
  240: 'decedfdfegafafae',
  300: 'bfafbgegegdfdfde'
}

const styles_K = {
  0: {left: -33, top: -57},
  60: {left: -8, top: -95},
  120: {left: 127, top: -147},
  180: {left: -30, top: -3},
  240: {left: 126, top: -69},
  300: {left: -10, top: -17}
}

const blueprints_L = {
  0: 'aeadaeadaeadae.1ae1e3ae3e5ae5e7ae7e',
  60: 'ccbdbfagagbfdfee.1cc2dc3fc4gc5af6bf7df8ef',
  120: 'ffdfcgagbhbfcecc.1fd2dd3cd4ad5ha6fa7ea8ca'
}

const styles_L = {
  0: {top: -22},
  60: {left: -4, top: 107},
  120: {left: -4, top: 159}
}

const blueprints_M = {
  0: 'beaeafaeafaebe.3ae3f5ae5f',
  60: 'cebfbgagbgbfdf.1ec2fc6bf7df',
  120: 'dfbfbgagbgbfce.1dd2bd6fa7ea'
}

const styles_M = {
  0: {top: -5},
  60: {left: -49, top: 101},
  120: {left: -50, top: 103},
  180: {left: -53, top: -2},
  240: {left: -54, top: 101},
  300: {left: -53, top: 99}
}

const blueprints_N = {
  0: 'ahagahagahagah.1ae1h3ae3h5ae5h7ae7h',
  60: 'eedfdhcicibhbhagcgdfff.1ec2fc3hc4ic8af9cf10df11ff',
  120: 'ffdfcgagbhbhcicidhdfee.1fd2dd3cd4ad8ia9ha10fa11ea'
}

const styles_N = {
  0: {left: -52, top: -22},
  60: {left: 127, top: 81},
  120: {left: 129, top: 80},
  180: {left: -52, top: -24}
}

export const pieceList = {
  corridor: [
    bitmap_tiles,
    {
      0: 'ab',
      60: 'bbaa',
      120: 'aaaa'
    },
    {
      0: {left: 0, top: 0},
      60: {left: 45, top: 26},
      120: {left: 45, top: -26},
    },
    0,
    true
  ],

  door: [
    bitmap_tiles,
    {
      0: 'aa'
    },
    {
      0: {left: 1, top: -1}
    },
    0,
    true
  ],

  A1a: [
    bitmap_A1a,
    blueprints_A,
    styles_A,
    0
  ],

  A1b: [
    bitmap_A1b,
    blueprints_A,
    styles_A,
    1
  ],

  A2a: [
    bitmap_A2a,
    blueprints_A,
    styles_A,
    0
  ],

  A2b: [
    bitmap_A2b,
    blueprints_A,
    styles_A,
    2
  ],

  A3a: [
    bitmap_A3a,
    blueprints_A,
    styles_A,
    2
  ],

  A3b: [
    bitmap_A3b,
    blueprints_A,
    styles_A,
    0
  ],

  A4a: [
    bitmap_A4a,
    blueprints_A,
    styles_A,
    3
  ],

  A4b: [
    bitmap_A4b,
    blueprints_A,
    styles_A,
    0
  ],

  B1a: [
    bitmap_B1a,
    blueprints_B,
    styles_B,
    1
  ],

  B1b: [
    bitmap_B1b,
    blueprints_B,
    styles_B,
    3
  ],

  B2a: [
    bitmap_B2a,
    blueprints_B,
    styles_B,
    1
  ],

  B2b: [
    bitmap_B2b,
    blueprints_B,
    styles_B,
    0
  ],

  B3a: [
    bitmap_B3a,
    blueprints_B,
    styles_B,
    1
  ],

  B3b: [
    bitmap_B3b,
    blueprints_B,
    styles_B,
    0
  ],

  B4a: [
    bitmap_B4a,
    blueprints_B,
    styles_B,
    1
  ],

  B4b: [
    bitmap_B4b,
    blueprints_B,
    styles_B,
    2
  ],

  C1a: [
    bitmap_C1a,
    blueprints_C,
    styles_C,
    0
  ],

  C1b: [
    bitmap_C1b,
    blueprints_C,
    styles_C,
    1
  ],

  C2a: [
    bitmap_C2a,
    blueprints_C,
    styles_C,
    3
  ],

  C2b: [
    bitmap_C2b,
    blueprints_C,
    styles_C,
    0
  ],

  D1a: [
    bitmap_D1a,
    blueprints_D,
    styles_D,
    0,
    true
  ],

  D1b: [
    bitmap_D1b,
    blueprints_D,
    styles_D,
    3,
    true
  ],

  D2a: [
    bitmap_D2a,
    blueprints_D,
    styles_D,
    0,
    true
  ],

  D2b: [
    bitmap_D2b,
    blueprints_D,
    styles_D,
    2,
    true
  ],

  E1a: [
    bitmap_E1a,
    blueprints_E,
    styles_E,
    0,
    true
  ],

  E1b: [
    bitmap_E1b,
    blueprints_E,
    styles_E,
    2,
    true
  ],

  F1a: [
    bitmap_F1a,
    blueprints_F,
    styles_F,
    0,
    true
  ],

  F1b: [
    bitmap_F1b,
    blueprints_F,
    styles_F,
    3,
    true
  ],

  G1a: [
    bitmap_G1a,
    blueprints_G,
    styles_G,
    3,
    true
  ],

  G1b: [
    bitmap_G1b,
    blueprints_G,
    styles_G,
    0,
    true
  ],

  G2a: [
    bitmap_G2a,
    blueprints_G,
    styles_G,
    2,
    true
  ],

  G2b: [
    bitmap_G2b,
    blueprints_G,
    styles_G,
    1,
    true
  ],

  H1a: [
    bitmap_H1a,
    blueprints_H,
    styles_H,
    2
  ],

  H1b: [
    bitmap_H1b,
    blueprints_H,
    styles_H,
    0
  ],

  H2a: [
    bitmap_H2a,
    blueprints_H,
    styles_H,
    2
  ],

  H2b: [
    bitmap_H2b,
    blueprints_H,
    styles_H,
    3
  ],

  H3a: [
    bitmap_H3a,
    blueprints_H,
    styles_H,
    1
  ],

  H3b: [
    bitmap_H3b,
    blueprints_H,
    styles_H,
    0
  ],

  I1a: [
    bitmap_I1a,
    blueprints_I,
    styles_I,
    1,
    true
  ],

  I1b: [
    bitmap_I1b,
    blueprints_I,
    {
      0: {left: -55, top: -26},
      60: {left: 84, top: 51},
      120: {left: 88, top: 3},
      180: {left: -48, top: -17},
      240: {left: 81, top: 61},
      300: {left: 78, top: 5}
    },
    0,
    true
  ],

  I2a: [
    bitmap_I2a,
    blueprints_I,
    styles_I,
    2,
    true
  ],

  I2b: [
    bitmap_I2b,
    blueprints_I,
    styles_I,
    1,
    true
  ],

  J1a: [
    bitmap_J1a,
    blueprints_Ja,
    styles_Ja,
    0
  ],

  J1b: [
    bitmap_J1b,
    blueprints_Jb,
    styles_Jb,
    2
  ],

  J2a: [
    bitmap_J2a,
    blueprints_Ja,
    styles_Ja,
    0
  ],

  J2b: [
    bitmap_J2b,
    blueprints_Jb,
    styles_Jb,
    2
  ],

  K1a: [
    bitmap_K1a,
    blueprints_K,
    styles_K,
    0
  ],

  K1b: [
    bitmap_K1b,
    blueprints_K,
    styles_K,
    2
  ],

  K2a: [
    bitmap_K2a,
    blueprints_K,
    styles_K,
    2
  ],

  K2b: [
    bitmap_K2b,
    blueprints_K,
    styles_K,
    0
  ],

  L1a: [
    bitmap_L1a,
    blueprints_L,
    styles_L,
    0,
    true
  ],

  L1b: [
    bitmap_L1b,
    blueprints_L,
    styles_L,
    3,
    true
  ],

  L2a: [
    bitmap_L2a,
    blueprints_L,
    styles_L,
    2,
    true
  ],

  L2b: [
    bitmap_L2b,
    blueprints_L,
    styles_L,
    0,
    true
  ],

  L3a: [
    bitmap_L3a,
    blueprints_L,
    styles_L,
    3,
    true
  ],

  L3b: [
    bitmap_L3b,
    blueprints_L,
    styles_L,
    2,
    true
  ],

  M1a: [
    bitmap_M1a,
    blueprints_M,
    styles_M,
    0,
    true
  ],

  M1b: [
    bitmap_M1b,
    blueprints_M,
    styles_M,
    3,
    true
  ],

  N1a: [
    bitmap_N1a,
    blueprints_N,
    styles_N,
    2,
    true
  ],

  N1b: [
    bitmap_N1b,
    blueprints_N,
    styles_N,
    0,
    true
  ]
}
