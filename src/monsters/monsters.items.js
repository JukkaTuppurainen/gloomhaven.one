import bitmap_bones   from '../assets/bones.webp'
import bitmap_boulder from '../assets/boulder.webp'
import bitmap_inox    from '../assets/inox.webp'
import bitmap_trap    from '../assets/trap.webp'
import bitmap_water   from '../assets/water.webp'


export const itemsList = {
  monster: {
    name: 'Monster',
    bitmap: bitmap_bones
  },
  obstacle: {
    name: 'Obstacle',
    bitmap: bitmap_boulder
  },
  trap: {
    name: 'Trap',
    bitmap: bitmap_trap
  },
  difficult: {
    name: 'Difficult terrain',
    bitmap: bitmap_water
  },
  player: {
    name: 'Player character',
    bitmap: bitmap_inox
  }
}
