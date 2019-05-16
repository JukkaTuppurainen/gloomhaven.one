import bitmap_door from '../../scenarios/door.webp'

import bitmap_A1a  from '../../scenarios/A1a.webp'
import bitmap_A1b  from '../../scenarios/A1b.webp'
import bitmap_A2a  from '../../scenarios/A2a.webp'
import bitmap_A2b  from '../../scenarios/A2b.webp'
import bitmap_A3a  from '../../scenarios/A3a.webp'
import bitmap_A3b  from '../../scenarios/A3b.webp'
import bitmap_A4a  from '../../scenarios/A4a.webp'
import bitmap_A4b  from '../../scenarios/A4b.webp'

import bitmap_B1a  from '../../scenarios/B1a.webp'
import bitmap_B1b  from '../../scenarios/B1b.webp'
import bitmap_B2a  from '../../scenarios/B2a.webp'
import bitmap_B2b  from '../../scenarios/B2b.webp'
import bitmap_B3a  from '../../scenarios/B3a.webp'
import bitmap_B3b  from '../../scenarios/B3b.webp'
import bitmap_B4a  from '../../scenarios/B4a.webp'
import bitmap_B4b  from '../../scenarios/B4b.webp'

import bitmap_C1a  from '../../scenarios/C1a.webp'
import bitmap_C1b  from '../../scenarios/C1b.webp'
import bitmap_C2a  from '../../scenarios/C2a.webp'
import bitmap_C2b  from '../../scenarios/C2b.webp'

import bitmap_D1a  from '../../scenarios/D1a.webp'
import bitmap_D1b  from '../../scenarios/D1b.webp'
import bitmap_D2a  from '../../scenarios/D2a.webp'
import bitmap_D2b  from '../../scenarios/D2b.webp'

import bitmap_E1a  from '../../scenarios/E1a.webp'
import bitmap_E1b  from '../../scenarios/E1b.webp'

import bitmap_F1a  from '../../scenarios/F1a.webp'
import bitmap_F1b  from '../../scenarios/F1b.webp'

import bitmap_G1a  from '../../scenarios/G1a.webp'
import bitmap_G1b  from '../../scenarios/G1b.webp'
import bitmap_G2a  from '../../scenarios/G2a.webp'
import bitmap_G2b  from '../../scenarios/G2b.webp'

import bitmap_H1a  from '../../scenarios/H1a.webp'
import bitmap_H1b  from '../../scenarios/H1b.webp'
import bitmap_H2a  from '../../scenarios/H2a.webp'
import bitmap_H2b  from '../../scenarios/H2b.webp'
import bitmap_H3a  from '../../scenarios/H3a.webp'
import bitmap_H3b  from '../../scenarios/H3b.webp'

import bitmap_I1b  from '../../scenarios/I1b.webp'
import bitmap_J1a  from '../../scenarios/J1a.webp'
import bitmap_L1a  from '../../scenarios/L1a.webp'


const blueprints_A = {
  0: 'beae.2ae2e',
  180: 'aead.1ae1e'
}

const styles_A = {
  0: {top: 28}
}

const blueprints_B = {
  0: 'adacadac.1ae1d3ae3d',
  180: 'bdadbdad.2ae2d4ae4d'
}

const styles_B = {
  0: {left: -53, top: -23},
  180: {top: 30}
}

const blueprints_C = {
  0: 'bcacadac',
  180: 'bdadbdbc'
}

const styles_C = {
  0: {left: -48, top: -54},
  180: {top: 0}
}

const blueprints_D = {
  0: 'bdadaeadbd'
}

const styles_D = {
  0: {left: -52, top: -57},
  180: {left: -52, top: -55}
}

const blueprints_E = {
  0: 'beaebeaebe.2ae2e4ae4e'
}

const styles_E = {
  0: {left: -49, top: 29},
  180: {left: -52, top: 32}
}

const blueprints_F = {
  0: 'acabacabacabacabac.1ae1c3ae3c5ae5c7ae7c9ae9c'
}

const styles_F = {
  0: {left: -32, top: -3},
  180: {left: -32, top: -23}
}

const blueprints_G = {
  0: 'ahagah.1ae1h3ae3h'
}

const blueprints_H = {
  0: 'bgagdecedecede.2ae2g4ce4e6ce6e',
  180: 'decedecedeagbg.2ce2e4ce4e6ae6g'
}

const styles_H = {
  0: {top: 27},
  180: {top: 27}
}

export const pieceList = {
  door: {
    bitmap: bitmap_door,
    blueprints: {
      0: 'aa'
    },
    styles: {
      0: {left: 0, top: 0}
    },
    symmetrical: true
  },

  // -------- A --------

  A1a: {
    bitmap: bitmap_A1a,
    blueprints: blueprints_A,
    styles: styles_A
  },

  A1b: {
    bitmap: bitmap_A1b,
    blueprints: blueprints_A,
    styles: styles_A
  },

  A2a: {
    bitmap: bitmap_A2a,
    blueprints: blueprints_A,
    styles: styles_A
  },

  A2b: {
    bitmap: bitmap_A2b,
    blueprints: blueprints_A,
    styles: styles_A
  },

  A3a: {
    bitmap: bitmap_A3a,
    blueprints: blueprints_A,
    styles: styles_A
  },

  A3b: {
    bitmap: bitmap_A3b,
    blueprints: blueprints_A,
    styles: styles_A
  },

  A4a: {
    bitmap: bitmap_A4a,
    blueprints: blueprints_A,
    styles: styles_A
  },

  A4b: {
    bitmap: bitmap_A4b,
    blueprints: blueprints_A,
    styles: styles_A
  },

  // -------- B --------

  B1a: {
    bitmap: bitmap_B1a,
    blueprints: blueprints_B,
    styles: styles_B
  },

  B1b: {
    bitmap: bitmap_B1b,
    blueprints: blueprints_B,
    styles: styles_B
  },

  B2a: {
    bitmap: bitmap_B2a,
    blueprints: blueprints_B,
    styles: styles_B
  },

  B2b: {
    bitmap: bitmap_B2b,
    blueprints: blueprints_B,
    styles: styles_B
  },

  B3a: {
    bitmap: bitmap_B3a,
    blueprints: blueprints_B,
    styles: styles_B
  },

  B3b: {
    bitmap: bitmap_B3b,
    blueprints: blueprints_B,
    styles: styles_B
  },

  B4a: {
    bitmap: bitmap_B4a,
    blueprints: blueprints_B,
    styles: styles_B
  },

  B4b: {
    bitmap: bitmap_B4b,
    blueprints: blueprints_B,
    styles: styles_B
  },

  // -------- C --------

  C1a: {
    bitmap: bitmap_C1a,
    blueprints: blueprints_C,
    styles: styles_C
  },

  C1b: {
    bitmap: bitmap_C1b,
    blueprints: blueprints_C,
    styles: styles_C
  },

  C2a: {
    bitmap: bitmap_C2a,
    blueprints: blueprints_C,
    styles: styles_C
  },

  C2b: {
    bitmap: bitmap_C2b,
    blueprints: blueprints_C,
    styles: styles_C
  },

  // -------- D --------

  D1a: {
    bitmap: bitmap_D1a,
    blueprints: blueprints_D,
    styles: styles_D,
    symmetrical: true
  },

  D1b: {
    bitmap: bitmap_D1b,
    blueprints: blueprints_D,
    styles: styles_D,
    symmetrical: true
  },

  D2a: {
    bitmap: bitmap_D2a,
    blueprints: blueprints_D,
    styles: styles_D,
    symmetrical: true
  },

  D2b: {
    bitmap: bitmap_D2b,
    blueprints: blueprints_D,
    styles: styles_D,
    symmetrical: true
  },

  // -------- E --------

  E1a: {
    bitmap: bitmap_E1a,
    blueprints: blueprints_E,
    styles: styles_E,
    symmetrical: true
  },

  E1b: {
    bitmap: bitmap_E1b,
    blueprints: blueprints_E,
    styles: styles_E,
    symmetrical: true
  },

  // -------- F --------

  F1a: {
    bitmap: bitmap_F1a,
    blueprints: blueprints_F,
    styles: styles_F,
    symmetrical: true
  },

  F1b: {
    bitmap: bitmap_F1b,
    blueprints: blueprints_F,
    styles: styles_F,
    symmetrical: true
  },

  // -------- G --------

  G1a: {
    bitmap: bitmap_G1a,
    blueprints: blueprints_G,
    symmetrical: true
  },

  G1b: {
    bitmap: bitmap_G1b,
    blueprints: blueprints_G,
    symmetrical: true
  },

  G2a: {
    bitmap: bitmap_G2a,
    blueprints: blueprints_G,
    symmetrical: true
  },

  G2b: {
    bitmap: bitmap_G2b,
    blueprints: blueprints_G,
    symmetrical: true
  },

  // -------- H --------

  H1a: {
    bitmap: bitmap_H1a,
    blueprints: blueprints_H,
    styles: styles_H
  },

  H1b: {
    bitmap: bitmap_H1b,
    blueprints: blueprints_H,
    styles: styles_H
  },

  H2a: {
    bitmap: bitmap_H2a,
    blueprints: blueprints_H,
    styles: styles_H
  },

  H2b: {
    bitmap: bitmap_H2b,
    blueprints: blueprints_H,
    styles: styles_H
  },

  H3a: {
    bitmap: bitmap_H3a,
    blueprints: blueprints_H,
    styles: styles_H
  },

  H3b: {
    bitmap: bitmap_H3b,
    blueprints: blueprints_H,
    styles: styles_H
  },

  // -------- other --------

  I1b: {
    bitmap: bitmap_I1b,
    blueprints: {
      0: 'afaeafaeaf.1ae1f3ae3f5ae5f',
      60: 'ddcecgbfbfaecedd.1dc2ec3gc6af7cf8df',
      120: 'ddbdaeaebfbfcecc.1dd2bd3ad6fa7ea8ca'
    },
    styles: {
      60: {left: 76, top: 47},
      120: {left: 75, top: -5},
      180: {left: -48, top: -20}
    },
    symmetrical: true
  },

  J1a: {
    bitmap: bitmap_J1a,
    blueprints: {
      0: 'aeafagegfhfhgg.1ae1ec2fc3ae6ha7ga',
      180: 'ccacbdbdcichei.1cd2ad5i6cf7ef7i'
    },
    styles: {
      180: {left: -32, top: -3}
    }
  },

  L1a: {
    bitmap: bitmap_L1a,
    blueprints: {
      0: 'aeadaeadaeadae.1ae1e3ae3e5ae5e7ae7e'
    },
    styles: {
      180: {left: -51, top: -23}
    },
    symmetrical: true
  }
}
