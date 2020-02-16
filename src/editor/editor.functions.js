import {editor}     from './editor'
import {
  createPieceControls,
  updatePieceControlPositions,
  updateTileSelectOptions
}                   from './editor.controls'
import {
  board,
  cornersCoordinates
}                   from '../board/board'
import {findSnap}   from '../board/board.functions'
import {
  clearScenario,
  scenarioLoad
}                   from '../board/board.scenarioLoad'
import {render}     from '../renderer/render'
import {
  addPoint,
  toPoint
}                   from '../lib/hexUtils'
import {resolveLOS} from '../lib/resolveLOS'


let monsterFunctions
if (/* global ENV_isTest */ !ENV_isTest) {
  (async () => {
    try {
      monsterFunctions = await import(/* webpackMode: 'weak' */ '../monsters/monsters.functions')
    } catch (nothing) {}
  })()
}

export const toChar = n => String.fromCharCode(n + (n < 27 ? 96 : 38))

export const createDragShadow = pieceOrItem => {
  const dragShadowElement = document.createElement('canvas')
  dragShadowElement.id = 'drag-shadow'
  dragShadowElement.height = pieceOrItem.pxH
  dragShadowElement.width = pieceOrItem.pxW

  const dragShadowCtx = dragShadowElement.getContext('2d')
  dragShadowCtx.fillStyle = '#f006'

  let outerEdges = []
  let x1
  let y1
  let x2
  let y2
  let prevLength

  dragShadowCtx.lineWidth = 2
  dragShadowCtx.setLineDash([5, 5])
  dragShadowCtx.strokeStyle = '#fff'

  pieceOrItem.pieceHexes.forEach(hex => {
    const corners = addPoint(cornersCoordinates, toPoint(hex))

    for (let i = 0; i < 6; ++i) {
      x1 = corners[i].x
      y1 = corners[i].y
      x2 = corners[i < 5 ? i + 1 : 0].x
      y2 = corners[i < 5 ? i + 1 : 0].y
      prevLength = outerEdges.length
      outerEdges = outerEdges.filter(edge => !(
        (edge.x1 === x1 && edge.x2 === x2 && edge.y1 === y1 && edge.y2 === y2) ||
        (edge.x1 === x2 && edge.x2 === x1 && edge.y1 === y2 && edge.y2 === y1)
      ))
      if (outerEdges.length === prevLength) {
        outerEdges.push({
          x1,
          y1,
          x2,
          y2
        })
      }
    }
  })

  dragShadowCtx.beginPath()
  outerEdges.forEach(edge => {
    dragShadowCtx.moveTo(edge.x1, edge.y1)
    dragShadowCtx.lineTo(edge.x2, edge.y2)
  })
  dragShadowCtx.stroke()

  document.body.appendChild(dragShadowElement)
}

export const deleteAllPieces = () => {
  board.pieces.length = 0
  document.getElementById('board').innerHTML = ''
  document.getElementById('piece-controls').innerHTML = ''

  generateEditorBoard()
  updateTileSelectOptions()

  if (monsterFunctions) {
    monsterFunctions.deleteAllItems()
  }
}

export const itemsToUpdate = []

export const deletePiece = index => {
  board.pieces.splice(index, 1)

  document.getElementById('board').removeChild(
    document.querySelectorAll('.map-tile')[index]
  )

  document.getElementById('piece-controls').removeChild(
    document.querySelectorAll('.control-wrap')[index]
  )

  generateEditorBoard()
  updateTileSelectOptions()
  createPieceControls()

  if (monsterFunctions) {
    monsterFunctions.deleteSomeItems()
  }
}

export const generateEditorBoard = () => {
  clearScenario()
  scenarioLoad(editor)
  generateBoardLayoutString()
}

const generateBoardLayoutString = () => {
  let layoutString = ''
  let k

  board.pieces.forEach(piece => {
    switch (piece.name) {
      case 'corridor':
      case 'door':
        k = piece.color
        break
      default:
        k = piece.name
    }

    layoutString += piece.ch.x + toChar(piece.ch.y) + k
    if (piece.rotation > 0) {
      layoutString += toChar((piece.rotation + 1) / 60)
    }
  })

  board.skipHashChangeHandler = true
  window.location.hash = ':' + layoutString
}

export const getPieceIndexFromBoard = (hex, ignore) => {
  for (let i = board.pieces.length - 1; i >= 0; --i) {
    let piece = board.pieces[i]
    if (
      piece.pieceHexes.find(pieceHex => (
        i !== ignore &&
        hex.x === pieceHex.x + piece.ch.x &&
        hex.y === pieceHex.y + piece.ch.y + (
          piece.ch.x % 2 === 1 && pieceHex.x % 2 === 1 ? 1 : 0
        )
      ))
    ) {
      return i
    }
  }
  return -1
}

export const startDragging = (x, y) => {
  delete board.playerHex
  resolveLOS()
  document.body.classList.add('editor-dragging')
  document.getElementById('editor-controls').style.display = 'none'
  editor.dragging = {x, y}

  itemsToUpdate.length = 0

  const dragPiece = board.pieces[editor.hoverPiece]
  if (dragPiece.ch) {
    const dragFromHexes = dragPiece.pieceHexes.map(dragPieceHexes => {
      let x = dragPieceHexes.x + dragPiece.ch.x
      let y = dragPieceHexes.y + dragPiece.ch.y + (dragPieceHexes.x & 1 ? dragPiece.ch.x & 1 : 0)

      dragPieceHexes.items = board.items.filter(item =>
        item.ch.x === x && item.ch.y === y
      )

      return ({x, y})
    })

    itemsToUpdate.push(...board.items.filter(item => {
      if (dragFromHexes.some(dragHex =>
        dragHex.x === item.ch.x &&
        dragHex.y === item.ch.y
      )) {
        item.dx = dragPiece.x - item.x + x
        item.dy = dragPiece.y - item.y + y
        return true
      }}
    ))

    board.items = board.items.filter(item => !itemsToUpdate.includes(item))
  }

  render()
  createDragShadow(dragPiece)
}

export const renderDOM = () => {
  let thingElementStyle
  const thingsToUpdate = []

  if (board.pieces[editor.hoverPiece]) {
    thingsToUpdate.push(board.pieces[editor.hoverPiece])
  }

  if (itemsToUpdate.length) {
    thingsToUpdate.push(...itemsToUpdate)
  }

  thingsToUpdate.forEach(thing => {
    thingElementStyle = thing.element.style
    thingElementStyle.left = `${thing.x}px`
    thingElementStyle.top = `${thing.y}px`
  })
}

export const stopDragging = () => {
  document.body.classList.remove('editor-dragging')
  document.getElementById('editor-controls').style.display = 'flex'

  editor.dragging = false
  render()
  const dragShadowElement = document.getElementById('drag-shadow')
  if (dragShadowElement) {
    document.body.removeChild(dragShadowElement)
  }

  board.cacheInvalid = true

  updatePieceControlPositions()
}

let isAlreadyOverBoardHex = true

export const updateDragShadow = (x, y, pieceOrItem) => {
  const closest = findSnap(pieceOrItem, x, y)
  const dragShadow = document.getElementById('drag-shadow')

  if (closest.closestPoint) {
    dragShadow.style.left = `${closest.closestPoint.x + board.pxOffset}px`
    dragShadow.style.top = `${closest.closestPoint.y}px`
  }

  if (pieceOrItem.type) {
    const overBoardHex = board.scenario.hexes.has(closest.closestHex)

    if (!overBoardHex) {
      if (isAlreadyOverBoardHex) {
        document.body.classList.add('no-drag')
        isAlreadyOverBoardHex = false
      }
    } else if (!isAlreadyOverBoardHex) {
      document.body.classList.remove('no-drag')
      isAlreadyOverBoardHex = true
    }
  }
}
