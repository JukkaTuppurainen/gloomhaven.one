import {editor}     from './editor'
import {
  generateEditorBoard,
  startDragging,
  stopDragging,
  updateDragShadow
}                   from './editor.functions'
import {board}      from '../board/board'
import {boardClick} from '../board/board.events'
import {findSnap}   from '../board/board.functions'
import {render}     from '../index'
import {pointToHex} from '../lib/hexUtils'


let mouseDownCoords = false
const minMouseMoveDeltaToConsiderClickAsDragging = 10

export const editorDocumentClick = event => {
  mouseDownCoords = false
  if (editor.dragging !== false) {
    stopDragging()
  } else if (!editor.on) {
    boardClick(event)
  }
}

const getPieceIndexFromBoard = (hex, ignore) => {
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

export const editorDocumentMousedown = event => {
  if (
    editor.on &&
    editor.dragging === false
  ) {
    editor.hoverPiece = false
    const hexFromPoint = pointToHex(event.pageX, event.pageY)

    const boardHoverPiece = getPieceIndexFromBoard(hexFromPoint)
    if (boardHoverPiece >= 0) {
      editor.hoverPiece = boardHoverPiece
    }

    if (editor.hoverPiece !== false) {
      mouseDownCoords = {
        x: event.pageX,
        y: event.pageY
      }

      render()
    }
  }
}

export const editorDocumentMousemove = event => {
  if (mouseDownCoords) {
    let deltaX = event.pageX - mouseDownCoords.x
    let deltaY = event.pageY - mouseDownCoords.y
    if (
      !editor.dragging &&
      editor.hoverPiece !== false && (
        deltaX > minMouseMoveDeltaToConsiderClickAsDragging ||
        deltaX < -minMouseMoveDeltaToConsiderClickAsDragging ||
        deltaY > minMouseMoveDeltaToConsiderClickAsDragging ||
        deltaY < -minMouseMoveDeltaToConsiderClickAsDragging
      )
    ) {
      startDragging(
        event.pageX - board.pieces[editor.hoverPiece].x,
        event.pageY - board.pieces[editor.hoverPiece].y
      )
    }
  }

  if (editor.dragging) {
    const piece = board.pieces[editor.hoverPiece]
    piece.x = event.pageX - editor.dragging.x
    piece.y = event.pageY - editor.dragging.y

    if (piece.name === 'corridor' || piece.name === 'door') {
      const boardIndex = getPieceIndexFromBoard(pointToHex(event.pageX, event.pageY), editor.hoverPiece)

      if (board.pieces[boardIndex]) {
        piece.color = piece.element.dataset['color'] = (
          board.pieces[boardIndex].color + (piece.name === 'corridor' ? 4 : 0)
        )
      }
    }

    renderDOM()
    updateDragShadow(event.pageX, event.pageY)
  }
}

export const editorDocumentMouseup = event => {
  if (editor.dragging) {
    const piece = board.pieces[editor.hoverPiece]
    const closest = findSnap(
      piece,
      event.pageX - editor.dragging.x,
      event.pageY - editor.dragging.y
    )

    if (closest.closestPoint) {
      piece.x = closest.closestPoint.x
      piece.y = closest.closestPoint.y
      piece.ch = closest.closestHex
      renderDOM()
    }
    generateEditorBoard()
  }
}

const renderDOM = () => {
  const piece = board.pieces[editor.hoverPiece]
  const draggedPieceStyle = piece.element.style
  draggedPieceStyle.left = `${piece.x}px`
  draggedPieceStyle.top = `${piece.y}px`
}

const synthesiseEventPageCoordinates = event => {
  if (event.touches && event.touches[0]) {
    event.pageX = event.touches[0].pageX
    event.pageY = event.touches[0].pageY
  }
}

let lastTouch = false

export const editorTouchend = event => {
  event.pageX = lastTouch.pageX
  event.pageY = lastTouch.pageY
  editorDocumentMouseup(event)
  editorDocumentClick(event)
}

export const editorTouchmove = event => {
  if (
    editor.on &&
    editor.hoverPiece !== false
  ) {
    event.preventDefault()
  }
  synthesiseEventPageCoordinates(event)
  editorDocumentMousemove(event)
  lastTouch = event
}

export const editorTouchstart = event => {
  synthesiseEventPageCoordinates(event)
  editorDocumentMousedown(event)
}
