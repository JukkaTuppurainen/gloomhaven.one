import {
  editor,
  editorGridDefaultHeight,
  editorGridDefaultWidth,
  editorPieces
}                             from './editor'
import {pieceList}            from './editor.pieces'
import {
  board,
  cornersCoordinates,
  Grid,
  hexHeight,
  hexWidth
}                             from '../board/board'
import {
  fromChar,
  hexCoordinatesToHexes,
  parseHexString,
  parseThinwallString
}                             from '../board/board.functions'
import {scenarioLoad}         from '../board/board.scenarioLoad'
import {
  getGridPxSize,
  rectangle,
  toPoint
}                             from '../hexUtils'
import {makeWall}             from '../makeWall'
import {updateEditorControls} from './editor.controls'


export const toChar = n => String.fromCharCode(n + (n < 27 ? 96 : 38))

export const createPiece = (x, y, pieceKey, angle = 0) => {
  const gridSize = {
    height: 0,
    width: 0
  }

  const pieceFromList = pieceList[pieceKey]

  let stringSplit
  let useAngle

  if (angle >= 180 && pieceFromList.symmetrical) {
    useAngle = angle - 180
  } else {
    useAngle = angle
  }

  stringSplit = pieceFromList.blueprints[useAngle].split('.')

  const hexString = stringSplit[0]
  const thinwallString = stringSplit[1]
  const pieceElement = document.createElement('div')
  const pieceElementCanvas = document.createElement('canvas')
  const pieceCtx = pieceElementCanvas.getContext('2d')
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
  const id = pieceKey + Date.now()

  pieceElement.dataset['id'] = id
  pieceElement.dataset['singleTile'] = isSingleTile
  pieceElement.classList.add('map-tile', 'img-loading')
  pieceElement.appendChild(pieceElementCanvas)
  pieceElement.style.height = `${pxSizeY}px`
  pieceElement.style.left = `${x}px`
  pieceElement.style.top = `${y}px`
  pieceElement.style.width = `${pxSizeX}px`
  pieceElementCanvas.height = pxSizeY
  pieceElementCanvas.width = pxSizeX
  pieceCtx.strokeStyle = '#fff'

  if (pieceFromList.bitmap) {
    const img = document.createElement('img')
    img.onload = () => pieceElement.classList.remove('img-loading')
    img.onerror = () => {
      pieceElement.classList.remove('img-loading')
      pieceElement.classList.add('img-error')
    }
    img.src = pieceFromList.bitmap
    if (angle > 0) {
      img.style.transform = `rotate(${angle}deg)`
    }
    if (pieceFromList.styles) {
      if (pieceFromList.styles[angle]) {
        Object.entries(pieceFromList.styles[angle]).forEach(keyValue => {
          img.style[keyValue[0]] = keyValue[1] * .75 + 'px'
        })
      }
      else if (pieceFromList.styles[useAngle]) {
        Object.entries(pieceFromList.styles[useAngle]).forEach(keyValue => {
          img.style[keyValue[0]] = keyValue[1] * .75 + 'px'
        })
      }
    }
    pieceElement.appendChild(img)
  }

  // -- Temporary render start
  // ---- grid for piece and highlight hexes based on blueprint
  // pieceCtx.font = '15px Arial'
  // pieceGrid.forEach(hex => {
  //   pieceCtx.strokeStyle = '#f00'
  //   const point = hex.toPoint()
  //   const corners = cornersCoordinates.map(corner => corner.add(point))
  //   const [firstCorner, ...otherCorners] = corners
  //
  //   pieceCtx.beginPath()
  //   pieceCtx.moveTo(firstCorner.x, firstCorner.y)
  //   otherCorners.forEach(({x, y}) => pieceCtx.lineTo(x, y))
  //   pieceCtx.lineTo(firstCorner.x, firstCorner.y)
  //   pieceCtx.stroke()
  //
  //   pieceCtx.fillStyle = '#fff'
  //   pieceCtx.fillText(
  //     String.fromCharCode(hex.y + 97),
  //     firstCorner.x - 66,
  //     firstCorner.y - 22
  //   )
  //   pieceCtx.fillStyle = '#f004'
  //
  //   if (pieceHexes.find(pieceHex => (
  //     pieceHex.x === hex.x && pieceHex.y === hex.y
  //   ))) {
  //     pieceCtx.fill()
  //   }
  // })
  // // ---- draw thinwalls
  // pieceCtx.lineWidth = 15
  // pieceCtx.strokeStyle = '#f0ff'
  // pieceHexes.forEach(pieceHex => {
  //   if (pieceHex.metaThinwalls) {
  //     const point = pieceHex.toPoint()
  //     const corners = cornersCoordinates.map(corner => corner.add(point))
  //     pieceHex.metaThinwalls.forEach(m => {
  //       pieceCtx.beginPath()
  //       pieceCtx.moveTo(corners[m].x, corners[m].y)
  //       m = m === 5 ? 0 : m + 1
  //       pieceCtx.lineTo(corners[m].x, corners[m].y)
  //       pieceCtx.stroke()
  //     })
  //   }
  // })
  // pieceCtx.lineWidth = 1
  // -- Temporary render end

  const piece = {
    canvas: pieceElementCanvas,
    ctx: pieceCtx,
    element: pieceElement,
    grid: pieceGrid,
    h: gridSize.height,
    id,
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

  if (editor.dragging !== false) {
    dragPxX -= editor.dragging.x
    dragPxY -= editor.dragging.y
  }

  let distance
  let shortestDistance = 999
  let closestPoint = false
  let closestHex = false

  board.grid.forEach(hex => {
    if (
      hex.x > 0 &&
      hex.y > 0 &&
      hex.x < editorGridDefaultWidth - piece.w &&
      hex.y < editorGridDefaultHeight - piece.h
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

export const generateBlueprintString = () => {
  const hexExport = {}
  let blueprintString = ''

  board.scenario.hexes.forEach(hex => {
    if (!hexExport[hex.x]) {
      hexExport[hex.x] = new Set()
    }

    hexExport[hex.x].add(hex.y)
  })

  let previousX = 0
  let previousLastY = 99

  Object.keys(hexExport).forEach(x => {
    x = parseInt(x, 10)
    const yArray = [...hexExport[x]].sort((a, b) => a > b ? 1 : -1)

    if (
      yArray[0] > previousLastY ||
      x > previousX + 1
    ) {
      blueprintString += x
    }

    previousX = x
    previousLastY = yArray[yArray.length - 1]

    let i = 0
    let start = 0

    while (i < yArray.length) {
      if (!start) {
        start = yArray[i]
      }
      if (
        (yArray[i + 1] > yArray[i] + 1) ||
        i === yArray.length - 1
      ) {
        blueprintString += toChar(start) + toChar(yArray[i])
        start = 0
      }
      ++i
    }
  })

  if (board.scenario.thinWalls.length) {
    blueprintString += '.'
    board.scenario.thinWalls.forEach(thinWall => {
      blueprintString += thinWall.meta.x + toChar(thinWall.meta.y)
      if (thinWall.meta.s !== 1) {
        blueprintString += toChar(thinWall.meta.s + 1)
      }
    })
  }

  return blueprintString
}

export const generateEditorBoard = () => {
  const hexesCenterCoordinates = []

  if (editorPieces.length) {
    const center = {
      x: hexWidth / 2,
      y: hexHeight / 2
    }

    editorPieces.forEach(piece => {
      piece.pieceHexes.forEach(pieceHex => {
        const centerCoordinates = toPoint(pieceHex)
        centerCoordinates.x += piece.x + center.x
        centerCoordinates.y += piece.y + center.y
        if (pieceHex.metaThinwalls) {
          centerCoordinates.metaThinwalls = pieceHex.metaThinwalls
        }

        hexesCenterCoordinates.push(centerCoordinates)
      })
    })
  }

  delete board.playerHex
  board.scenario.hexes.length = 0
  board.scenario.thinWalls.length = 0

  hexesCenterCoordinates.forEach(hexCenterCoordinates => {
    const hexFromPoint = Grid.pointToHex(hexCenterCoordinates.x, hexCenterCoordinates.y)
    board.scenario.hexes.push(hexFromPoint)

    if (hexCenterCoordinates.metaThinwalls) {
      hexCenterCoordinates.metaThinwalls.forEach(metaThinWall => {
        makeWall(
          hexFromPoint,
          metaThinWall,
          metaThinWall === 5 ? 0 : metaThinWall + 1,
          true
        )
      })
    }
  })

  editor.blueprint = generateBlueprintString()
  scenarioLoad(editor)
  generateBoardLayoutString()
}

const generateBoardLayoutString = () => {
  let layoutString = ''

  editorPieces.forEach(piece => {
    layoutString += piece.ch.x + toChar(piece.ch.y) + (piece.name === 'door' ? '0' : piece.name)
    if (piece.rotation > 0) {
      layoutString += toChar((piece.rotation + 1) / 60)
    }
  })

  window.location.hash = ':' + layoutString
}

export const generateBoardFromLayoutString = layoutString => {
  let i = 0
  let ii = 0
  let m
  let n
  let x
  let y
  let r
  let t

  const piecesToCreate = []

  while (i < layoutString.length) {
    m = layoutString.substr(i).match(/^\d+/)
    x = parseInt(m[0], 10)
    ii = m[0].length
    y = parseInt(fromChar(layoutString.substr(i + ii, 1)), 10)
    r = 0
    ++ii
    if (layoutString.substr(i + ii, 1) === '0') {
      n = 'door'
      ++ii
    } else {
      n = layoutString.substr(i + ii, 3)
      ii += 3
      t = layoutString.substr(i + ii, 1)
      if (t && !t.match(/\d/)) {
        r = parseInt(fromChar(layoutString.substr(i + ii, 1)), 10) * 60
        ++ii
      }
    }
    i += ii
    piecesToCreate.push({x, y, n, r})
  }

  scenarioLoad(editor)
  const draggablePiecesElement = document.getElementById('draggable-pieces')

  piecesToCreate.forEach(pieceToCreate => {
    const point = toPoint(pieceToCreate)
    const piece = createPiece(
      point.x,
      point.y,
      pieceToCreate.n,
      pieceToCreate.r
    )
    draggablePiecesElement.appendChild(piece.element)
    editorPieces.push(piece)
  })

  generateEditorBoard()
  updateEditorControls()
}
