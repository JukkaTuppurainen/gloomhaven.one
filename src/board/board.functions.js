import {
  board,
  cornersCoordinates
}                  from './board'
import {
  addPoint,
  getGridPxSize,
  gridGet,
  rectangle,
  toPoint
}                  from '../lib/hexUtils'
import {pieceList} from './board.pieces'


export const createPiece = (x, y, pieceKey, angle = 0) => {
  const gridSize = {
    height: 0,
    width: 0
  }

  const pieceFromList = pieceList[pieceKey]

  let stringSplit
  let useAngle

  if (angle >= 180 && pieceFromList[3] === true) {
    useAngle = angle - 180
  } else {
    useAngle = angle
  }

  stringSplit = pieceFromList[1][useAngle].split('.')

  const hexString = stringSplit[0]
  const thinwallString = stringSplit[1]
  const pieceElement = document.createElement('div')
  const hexCoordinates = parseHexString(hexString, gridSize, 0, -1)
  const pieceGrid = rectangle(gridSize)
  const pieceHexes = hexCoordinatesToHexes(hexCoordinates, pieceGrid)
  const {pxSizeX, pxSizeY} = getGridPxSize(pieceHexes)
  let pieceThinwalls
  if (thinwallString) {
    pieceThinwalls = parseThinwallString(thinwallString)
    pieceThinwalls.forEach(pieceThinwall => {
      let matchingHex = pieceHexes.find(pieceHex => (
        pieceHex.x === pieceThinwall[0] - 1 && pieceHex.y === pieceThinwall[1] - 1
      ))

      if (!matchingHex.metaThinwalls) {
        matchingHex.metaThinwalls = [pieceThinwall[2]]
      } else {
        matchingHex.metaThinwalls.push(pieceThinwall[2])
      }
    })
  }

  const isSingleTile = pieceHexes.length === 1
  const isUnique = pieceHexes.length > 2
  const id = pieceKey + Date.now()

  pieceElement.dataset['id'] = id
  pieceElement.classList.add('map-tile', 'img-loading')
  pieceElement.style.height = `${pxSizeY}px`
  pieceElement.style.left = `${x}px`
  pieceElement.style.top = `${y}px`
  pieceElement.style.width = `${pxSizeX}px`

  if (pieceFromList[0]) {
    const img = document.createElement('img')
    img.onload = () => pieceElement.classList.remove('img-loading')
    img.onerror = () => {
      pieceElement.classList.remove('img-loading')
      pieceElement.classList.add('img-error')

      const pieceElementCanvas = document.createElement('canvas')
      const pieceCtx = pieceElementCanvas.getContext('2d')
      pieceElementCanvas.height = pxSizeY
      pieceElementCanvas.width = pxSizeX
      pieceElement.appendChild(pieceElementCanvas)

      pieceCtx.fillStyle = '#0006'
      pieceGrid.forEach(hex => {
        if (pieceHexes.find(pieceHex => (
          pieceHex.x === hex.x && pieceHex.y === hex.y
        ))) {
          const [firstCorner, ...otherCorners] = addPoint(cornersCoordinates, toPoint(hex))
          pieceCtx.beginPath()
          pieceCtx.moveTo(firstCorner.x, firstCorner.y)
          otherCorners.forEach(({x, y}) => pieceCtx.lineTo(x, y))
          pieceCtx.lineTo(firstCorner.x, firstCorner.y)
          pieceCtx.fill()
        }
      })
    }
    img.src = pieceFromList[0]
    if (angle > 0) {
      img.style.transform = `rotate(${angle}deg)`
    }
    if (pieceFromList[2]) {
      if (pieceFromList[2][angle]) {
        Object.entries(pieceFromList[2][angle]).forEach(keyValue => {
          img.style[keyValue[0]] = keyValue[1] * .75 + 'px'
        })
      }
      else if (pieceFromList[2][useAngle]) {
        Object.entries(pieceFromList[2][useAngle]).forEach(keyValue => {
          img.style[keyValue[0]] = keyValue[1] * .75 + 'px'
        })
      }
    }
    pieceElement.appendChild(img)
  }

  const piece = {
    element: pieceElement,
    grid: pieceGrid,
    h: gridSize.height,
    id,
    isUnique,
    name: pieceKey,
    isSingleTile,
    pieceHexes,
    pxH: pxSizeY,
    pxW: pxSizeX,
    rotation: angle,
    w: gridSize.width,
    x,
    y
  }

  const closest = findSnap(piece, x, y)
  piece.ch = closest.closestHex

  return piece
}

export const findSnap = (piece, eventX, eventY) => {
  const dragPoint = toPoint(piece.grid[0])
  let dragPxX = eventX + cornersCoordinates[0].x + dragPoint.x
  let dragPxY = eventY + cornersCoordinates[0].y + dragPoint.y

  let distance
  let shortestDistance = 999
  let closestPoint = false
  let closestHex = false

  board.grid.forEach(hex => {
    if (
      hex.x > 0 &&
      hex.y > 0 &&
      hex.x < board.gridSize.width - piece.w &&
      hex.y < board.gridSize.height - piece.h
    ) {
      const point = toPoint(hex)
      const corner0 = {
        x: cornersCoordinates[0].x + point.x,
        y: cornersCoordinates[0].y + point.y
      }
      distance = Math.sqrt(((dragPxX - corner0.x) ** 2) + ((dragPxY - corner0.y) ** 2))

      if (distance < shortestDistance) {
        shortestDistance = distance
        closestPoint = point
        closestHex = hex
      }
    }
  })

  return {
    closestPoint,
    closestHex
  }
}

export const fromChar = c => {
  let n = c.charCodeAt(0)
  return n > 96 ? n - 96 : n - 38
}

export const generatePiecesFromLayoutString = layoutString => {
  let i = 0
  let ii = 0
  let m
  let n
  let x
  let y
  let r
  let t
  let k

  const piecesToCreate = []

  while (i < layoutString.length) {
    m = layoutString.substr(i).match(/^\d+/)
    x = parseInt(m[0], 10)
    ii = m[0].length
    y = parseInt(fromChar(layoutString.substr(i + ii, 1)), 10)
    r = 0
    ++ii
    k = layoutString.substr(i + ii, 1)
    if (k === '0') {
      n = 'door'
      ++ii
    } else if (k === '1') {
      n = 'corridor'
      ++ii
    } else {
      n = layoutString.substr(i + ii, 3)
      ii += 3
    }
    t = layoutString.substr(i + ii, 1)
    if (t && !t.match(/\d/)) {
      r = parseInt(fromChar(layoutString.substr(i + ii, 1)), 10) * 60
      ++ii
    }
    i += ii
    piecesToCreate.push({x, y, n, r})
  }

  const boardElement = document.getElementById('board')

  piecesToCreate.forEach(pieceToCreate => {
    const point = toPoint(pieceToCreate)
    const piece = createPiece(
      point.x,
      point.y,
      pieceToCreate.n,
      pieceToCreate.r
    )
    board.pieces.push(piece)
    boardElement.appendChild(piece.element)
  })
}

const hexSort = (a, b) => {
  if (a.x > b.x) {
    return 1
  }
  if (a.x < b.x) {
    return -1
  }
  if (a.y > b.y) {
    return 1
  }
  if (a.y < b.y) {
    return -1
  }
  return 0
}

export const getDataFromBoardPieces = () => {
  const hexesFromAllPieces = []
  let thinWallsFromAllPieces = []
  const antiThinWallsFromAllPieces = []

  let x
  let y
  let a

  board.pieces.forEach(piece => {
    if (piece.name === 'corridor') {
      a = piece.ch.x % 2 === 0 ? 0 : 1
      switch (piece.rotation) {
        case 0:
        case 180:
          antiThinWallsFromAllPieces.push(
            {x: piece.ch.x,     y: piece.ch.y,      s: 1},
            {x: piece.ch.x,     y: piece.ch.y + 1,  s: 4}
          )
          break
        case 60:
        case 240:
          antiThinWallsFromAllPieces.push(
            {x: piece.ch.x + 1, y: piece.ch.y + a,  s: 2},
            {x: piece.ch.x,     y: piece.ch.y + 1,  s: 5}
          )
          break
        case 120:
        case 300:
          antiThinWallsFromAllPieces.push(
            {x: piece.ch.x,     y: piece.ch.y,      s: 0},
            {x: piece.ch.x + 1, y: piece.ch.y + a,  s: 3}
          )
          break
      }
    }

    piece.pieceHexes.forEach(hex => {
      x = hex.x + piece.ch.x
      y = hex.y + piece.ch.y

      if (piece.ch.x % 2 === 1 && hex.x % 2 === 1) {
        y++
      }

      if (!hexesFromAllPieces.find(existingHex => (
        existingHex.x === x && existingHex.y === y
      ))) {
        hexesFromAllPieces.push({x, y})
      }

      if (hex.metaThinwalls) {
        hex.metaThinwalls.forEach(s => {

          if (!thinWallsFromAllPieces.find(existingThinWall => (
            existingThinWall.x === x &&
            existingThinWall.y === y &&
            existingThinWall.s === s
          ))) {
            thinWallsFromAllPieces.push({x, y, s})
          }
        })
      }
    })
  })

  hexesFromAllPieces.sort(hexSort)
  thinWallsFromAllPieces.sort(hexSort)
  thinWallsFromAllPieces = thinWallsFromAllPieces.filter(tw =>
    !antiThinWallsFromAllPieces.find(atw =>
      tw.x === atw.x &&
      tw.y === atw.y &&
      tw.s === atw.s
    )
  )

  return {
    hexes: hexesFromAllPieces,
    thinWalls: thinWallsFromAllPieces
  }
}

export const parseThinwallString = (thinWallString) => {
  let s
  let x = 0
  let y
  let i = 0
  const walls = []

  while (i < thinWallString.length) {
    let m = thinWallString.substr(i).match(/^\d+/)
    if (m) {
      x = parseInt(m[0], 10)
      i += m[0].length
    } else {
      y = fromChar(thinWallString.substr(i, 1))
      ++i

      if (i === thinWallString.length || thinWallString.substr(i, 1).match(/\d/)) {
        s = 1
      } else {
        s = fromChar(thinWallString[i]) - 1
        ++i
      }

      walls.push([x, y, s])
    }
  }

  return walls
}

export const parseHexString = (hexString, gridSize, gridSizeAdjust = 0, hexCoordAdjust = 0) => {
  let end
  let i = 0
  let previousLastY = 0
  let start
  let x = 1

  const hexCoordinates = []

  while (i < hexString.length) {
    let m = hexString.substr(i).match(/^\d+/)
    if (m) {
      x = parseInt(m[0], 10)
      i += m[0].length
      previousLastY = 0
    } else {
      start = fromChar(hexString.substr(i, 1))
      end = fromChar(hexString.substr(i + 1, 1))

      if (start <= previousLastY) {
        ++x
      }

      previousLastY = end

      if (end + gridSizeAdjust > gridSize.height) {
        gridSize.height = end + gridSizeAdjust
      }

      if (x + gridSizeAdjust > gridSize.width) {
        gridSize.width = x + gridSizeAdjust
      }

      for (let y = start; y <= end; ++y) {
        hexCoordinates.push(x + hexCoordAdjust, y + hexCoordAdjust)
      }

      i += 2
    }
  }

  return hexCoordinates
}

export const hexCoordinatesToHexes = (hexCoordinates, grid) => {
  const hexes = []

  for (let i = 0; i < hexCoordinates.length; i += 2) {
    const gridHex = gridGet({
      x: hexCoordinates[i],
      y: hexCoordinates[i + 1]
    }, grid)
    if (gridHex) {
      hexes.push(gridHex)
    }
  }

  return hexes
}
