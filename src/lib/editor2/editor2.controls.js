import {
  editor2,
  editor2pieces,
  generateEditor2board,
  startDragging
}                      from './editor2'
import {pieceList}     from './editor2.pieces'
import {
  // cornersCoordinates,
  Grid
}                      from '../board/board'
import {
  hexCoordinatesToHexes,
  parseHexString,
  parseThinwallString
}                      from '../board/board.functions'
import {getGridPxSize} from '../board/board.scenarioLoad'


const createPiece = (x, y, pieceKey, angle) => {
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
    throw Error(`Piece ${pieceKey} does not support angle ${angle}.`)
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

  pieceElement.classList.add('map-tile')
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
  // // ---- grid for piece and highlight hexes based on blueprint
  // pieceCtx.fillStyle = '#f004'
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
    id: pieceKey,
    isSingleTile: pieceHexes.length === 1,
    pieceHexes,
    pxH: pxSizeY,
    pxW: pxSizeX,
    w: gridSize.width,
    x,
    y
  }
}

export const createPieceBtnClick = event => {
  if (event.target.nodeName === 'BUTTON') {
    const pieceKey = event.target.dataset['piece']
    const piece = createPiece(event.pageX, event.pageY, pieceKey, 0)

    document.getElementById('draggable-pieces').appendChild(piece.element)

    editor2.hoverPiece = editor2pieces.push(piece) - 1
    startDragging(0, 0)

    updateEditor2Controls()
  }
}

export const updateEditor2Controls = () => {
  const pieceListElement = document.getElementById('tile-list')
  pieceListElement.innerHTML = ''

  document.querySelectorAll('#tile-btns button').forEach(n => n.removeAttribute('disabled'))

  editor2pieces.forEach((piece, i) => {
    const pieceListItem = document.createElement('li')
    pieceListItem.id = piece.id
    pieceListItem.innerHTML = `
<span>${piece.id}</span>
<span>
  <!--<button data-rotate="${i}" type="button">R</button>-->
  <button data-delete="${i}" type="button">X</button>
</span>
`
    pieceListElement.appendChild(pieceListItem)

    if (!piece.isSingleTile) {
      document.querySelectorAll(`button[data-piece="${piece.id}"]`).forEach(n => n.setAttribute('disabled', true))
    }
  })
}

export const tileListBtnClick = event => {
  if (event.target.nodeName === 'BUTTON') {
    if (event.target.dataset['delete']) {
      const id = parseInt(event.target.dataset['delete'], 10)
      editor2pieces.splice(id, 1)
      updateEditor2Controls()

      document.getElementById('draggable-pieces').removeChild(
        document.querySelectorAll('.map-tile')[id]
      )

      generateEditor2board()
    }
    // if (event.target.dataset['rotate']) {}
  }
}
