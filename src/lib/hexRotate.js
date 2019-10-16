const toCube = hex => {
  let x = hex.x
  let z = hex.y - (hex.x - (hex.x & 1)) / 2
  let y = -x - z

  return [x, y, z]
}

export const rotateHexes = (hexes, steps = 1) => {
  let avgX = 0
  let avgY = 0

  hexes.forEach(hex => {
    avgX += hex.x
    avgY += hex.y
  })

  avgX /= hexes.length
  avgY /= hexes.length

  avgX = (avgX + .5) | 0
  avgY = (avgY + .5) | 0

  let [cx, cy, cz] = toCube({x: avgX, y: avgY})

  let minX = 99
  let minY = 99

  let rotatedHexes = hexes.map(hex => {
    let [x, y, z] = toCube(hex)

    let vx = x - cx
    let vy = y - cy
    let vz = z - cz

    let i = steps

    while (i !== 0) {
      if (i > 0) {
        [vx, vy, vz] = [-vz, -vx, -vy]
        --i
      } else {
        [vx, vy, vz] = [-vy, -vz, -vx]
        ++i
      }
    }

    vx += cx
    vz += cz

    x = vx
    y = vz + (vx - (vx & 1)) / 2

    if (x < minX) { minX = x }
    if (y < minY) { minY = y }

    const ret = {x, y}
    if (hex.mt) {
      ret.mt = hex.mt.map(m => {
        m += steps
        if (m > 5) { m -= 6 }
        if (m < 0) { m += 6 }
        return m
      })
    }

    return ret
  })

  let reAdjustY = false

  rotatedHexes.forEach(hex => {
    if (minX !== 0) {
      hex.x -= minX
    }

    if (minY !== 0) {
      hex.y -= minY
    }

    if (minX & 1 && hex.x & 1) {
      --hex.y
    }

    if (hex.y < 0) {
      reAdjustY = true
    }
  })

  if (reAdjustY) {
    rotatedHexes.forEach(hex => ++hex.y)
  }

  return rotatedHexes
}
