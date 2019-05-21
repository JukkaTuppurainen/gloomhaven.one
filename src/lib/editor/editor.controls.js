import {
  editor,
  editorPieces
}                            from './editor'
import {startDragging}       from './editor.events'
import {generateEditorBoard} from './editor.functions'
import {pieceList}           from './editor.pieces'
import {
  // cornersCoordinates,
  Grid
}                            from '../board/board'
import {
  hexCoordinatesToHexes,
  parseHexString,
  parseThinwallString
}                            from '../board/board.functions'
import {getGridPxSize}       from '../hexUtils'


const createPiece = (x, y, pieceKey, angle = 0) => {
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

  if (!pieceFromList.blueprints[useAngle]) {
    throw Error(`Piece ${pieceKey} does not support angle of ${angle}deg.`)
  }

  stringSplit = pieceFromList.blueprints[useAngle].split('.')

  const hexString = stringSplit[0]
  const thinwallString = stringSplit[1]
  const pieceElement = document.createElement('div')
  const pieceElementCanvas = document.createElement('canvas')
  const pieceCtx = pieceElementCanvas.getContext('2d')
  const hexCoordinates = parseHexString(hexString, gridSize, 0, -1)
  const pieceGrid = Grid.rectangle(gridSize)
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
          img.style[keyValue[0]] = keyValue[1] + 'px'
        })
      }
      else if (pieceFromList.styles[useAngle]) {
        Object.entries(pieceFromList.styles[useAngle]).forEach(keyValue => {
          img.style[keyValue[0]] = keyValue[1] + 'px'
        })
      }
    }
    pieceElement.appendChild(img)
  }

  // -- Temporary render start
  // ---- grid for piece and highlight hexes based on blueprint
  // pieceCtx.font = '18px Arial'
  // pieceGrid.forEach(hex => {
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
  //     firstCorner.x - 80,
  //     firstCorner.y - 30
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

  return {
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
}

const pieceSort = (a, b) => {
  if (a.isSingleTile && !b.isSingleTile) {
    return 1
  }
  if (!a.isSingleTile && b.isSingleTile) {
    return -1
  }
  return a.id > b.id ? 1 : -1
}

const elementSort = (a, b) => {
  if (a.dataset['singleTile'] === 'true' && b.dataset['singleTile'] !== 'true') {
    return 1
  }
  if (a.dataset['singleTile'] !== 'true' && b.dataset['singleTile'] === 'true') {
    return -1
  }
  return a.dataset['id'] > b.dataset['id'] ? 1 : -1
}

export const createPieceBtnClick = event => {
  if (event.target.nodeName === 'BUTTON') {
    const pieceKey = event.target.dataset['piece']
    const piece = createPiece(event.pageX, event.pageY, pieceKey)
    const draggablePiecesElement = document.getElementById('draggable-pieces')

    draggablePiecesElement.appendChild(piece.element)
    ;[...draggablePiecesElement.children]
      .sort(elementSort)
      .forEach(node => draggablePiecesElement.appendChild(node))

    editorPieces.push(piece)
    editorPieces.sort(pieceSort)

    editor.hoverPiece = editorPieces.findIndex(p => p.id === piece.id)

    startDragging(0, 0)

    updateEditorControls()
  }
}

export const updateEditorControls = () => {
  const pieceListElement = document.getElementById('tile-list')
  pieceListElement.innerHTML = ''

  document.querySelectorAll('#tile-btns button').forEach(n => n.removeAttribute('disabled'))

  editorPieces.forEach((piece, i) => {
    const pieceListItem = document.createElement('li')
    pieceListItem.id = piece.id
    pieceListItem.innerHTML = `<span>${piece.name}</span><span><button data-rotate="${i}" type="button">R</button><button data-delete="${i}" type="button">X</button></span>`
    pieceListElement.appendChild(pieceListItem)

    if (!piece.isSingleTile) {
      document.querySelector(`button[data-piece="${piece.name}"]`).setAttribute('disabled', true)
    }
  })
}

export const tileListBtnClick = event => {
  if (event.target.nodeName === 'BUTTON') {
    if (event.target.dataset['delete']) {
      const index = parseInt(event.target.dataset['delete'], 10)
      editorPieces.splice(index, 1)
      updateEditorControls()

      document.getElementById('draggable-pieces').removeChild(
        document.querySelectorAll('.map-tile')[index]
      )

      generateEditorBoard()
    }
    if (event.target.dataset['rotate']) {
      const index = parseInt(event.target.dataset['rotate'], 10)
      const piece = editorPieces[index]
      const name = piece.name
      const newAngle = piece.rotation === 0 ? 180 : 0
      const draggablePiecesElement = document.getElementById('draggable-pieces')

      draggablePiecesElement.removeChild(
        document.querySelectorAll('.map-tile')[index]
      )

      const newPiece = createPiece(piece.x, piece.y, name, newAngle)
      editorPieces.splice(index, 1)
      editorPieces.push(newPiece)
      editorPieces.sort(pieceSort)

      draggablePiecesElement.appendChild(newPiece.element)

      ;[...draggablePiecesElement.children]
        .sort(elementSort)
        .forEach(node => draggablePiecesElement.appendChild(node))

      generateEditorBoard()
    }
  }
}
